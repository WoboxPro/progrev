<?php
declare(strict_types=1);

use PDO;

header('Content-Type: application/json; charset=utf-8');

function respond($ok, $message = null, $extra = []){
    echo json_encode(array_merge(['success'=>$ok, 'message'=>$message], $extra), JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    $dir = $_SERVER['DOCUMENT_ROOT'] . '/system/migragion';
    if (!is_dir($dir)) @mkdir($dir, 0777, true);

    // Считываем все миграции
    $files = glob($dir . '/*__*.json');
    usort($files, function($a,$b){ return strcmp($a,$b); });

    // Группируем по dbName (если не задан, считаем как default null)
    $groups = [];
    foreach ($files as $file) {
        $raw = file_get_contents($file);
        $meta = json_decode($raw, true) ?: [];
        $dbName = $meta['dbName'] ?? null;
        $groups[$dbName][] = ['file'=>$file, 'meta'=>$meta, 'raw'=>$raw];
    }

    // Подготовим соединение с БД по конфигу (ищем в configs.json по name_db)
    $configs = @json_decode(@file_get_contents($_SERVER['DOCUMENT_ROOT'].'/system/core/configs/configs.json'), true) ?: [];
    $devType = @json_decode(@file_get_contents($_SERVER['DOCUMENT_ROOT'].'/system/core/configs/typeDev.json'), true) ?: ['status'=>'local'];
    $listName = ($devType['status'] ?? 'local') === 'prod' ? 'DBList_Server' : 'DBList';
    $dbList = $configs['project'][$listName] ?? [];

    $appliedCount = 0;

    foreach ($groups as $dbName => $items) {
        // найти конфиг подключения по имени
        $dbConf = null;
        foreach ($dbList as $it) {
            if ($dbName === null) { $dbConf = $it; break; }
            if (($it['name_db'] ?? null) === $dbName) { $dbConf = $it; break; }
        }
        if (!$dbConf) continue; // нет подключения — пропустим
        // Поддерживаем только pgsql сейчас
        if (($dbConf['subd'] ?? '') !== 'pgsql') continue;

        $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $dbConf['server'] ?? 'postgres', '5432', $dbConf['name_db'] ?? 'app');
        $pdo = new PDO($dsn, $dbConf['username'] ?? 'postgres', $dbConf['user_password'] ?? 'postgres', [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);

        // ensure schema_migrations
        $pdo->exec("CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, name text NOT NULL, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())");

        // Получить уже применённые версии
        $applied = [];
        foreach ($pdo->query('SELECT version, checksum FROM schema_migrations') as $row) {
            $applied[$row['version']] = $row['checksum'];
        }

        foreach ($items as $entry) {
            $meta = $entry['meta'];
            $raw = $entry['raw'];
            $version = $meta['version'] ?? null;
            $name = $meta['name'] ?? null;
            if (!$version || !$name) continue;

            $checksum = hash('sha256', $raw);
            if (isset($applied[$version])) {
                // уже применена — можно проверить checksum на грязность
                if ($applied[$version] !== $checksum) {
                    // пометить, но не падать
                    // можно копить warnings[]
                }
                continue;
            }

            $requires = (array)($meta['requiresExtensions'] ?? []);
            $schema = isset($meta['schema']) && $meta['schema'] !== '' ? (string)$meta['schema'] : null;
            $up = (array)($meta['up'] ?? []);
            $transactional = !empty($meta['transactional']);

            // prepare session settings (schema)
            $sessionPresql = [];
            if ($schema) {
                // безопасная проверка имени схемы
                if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $schema)) throw new RuntimeException('Bad schema name');
                $sessionPresql[] = 'SET search_path TO "'.str_replace('"','""',$schema).'", public';
                // auto create schema
                $pdo->exec('CREATE SCHEMA IF NOT EXISTS "'.str_replace('"','""',$schema).'"');
            }

            foreach ($requires as $ext) {
                if ($ext) $pdo->exec('CREATE EXTENSION IF NOT EXISTS "'.str_replace('"','""',$ext).'"');
            }

            try {
                if ($transactional) $pdo->beginTransaction();
                foreach ($sessionPresql as $sql) { $pdo->exec($sql); }
                foreach ($up as $sql) { if ($sql !== '') $pdo->exec($sql); }
                $stmt = $pdo->prepare('INSERT INTO schema_migrations(version,name,checksum) VALUES (?,?,?)');
                $stmt->execute([$version, $name, $checksum]);
                if ($transactional) $pdo->commit();
                $appliedCount++;
            } catch (Throwable $e) {
                if ($transactional && $pdo->inTransaction()) $pdo->rollBack();
                throw $e;
            }
        }
    }

    respond(true, null, ['applied'=>$appliedCount]);
} catch (Throwable $e) {
    http_response_code(500);
    respond(false, $e->getMessage());
}
