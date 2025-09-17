<?php
declare(strict_types=1);

use PDO;use PDOException;

header('Content-Type: application/json; charset=utf-8');

$dir = $_SERVER['DOCUMENT_ROOT'] . '/system/migragion'; // по просьбе пользователя
@mkdir($dir, 0777, true);

// Собираем все миграции
$rawItems = [];
foreach (glob($dir . '/*__*.json') as $file) {
    $basename = basename($file);
    if (!preg_match('/^([0-9]{8}_[0-9]{6})__([^.]+)\.json$/', $basename, $m)) continue;
    $raw = file_get_contents($file);
    $meta = json_decode($raw, true) ?: [];
    $rawItems[] = [
        'file' => $file,
        'basename' => $basename,
        'version' => $meta['version'] ?? $m[1],
        'name' => $meta['name'] ?? $m[2],
        'dbName' => $meta['dbName'] ?? ($meta['database'] ?? null),
        'transactional' => isset($meta['transactional']) ? (bool)$meta['transactional'] : true,
        'modifiedAt' => date('Y-m-d H:i:s', filemtime($file)),
        'meta' => $meta,
        'raw' => $raw,
    ];
}

// Получаем список конфигураций БД
$configs = @json_decode(@file_get_contents($_SERVER['DOCUMENT_ROOT'].'/system/core/configs/configs.json'), true) ?: [];
$devType = @json_decode(@file_get_contents($_SERVER['DOCUMENT_ROOT'].'/system/core/configs/typeDev.json'), true) ?: ['status'=>'local'];
$listName = ($devType['status'] ?? 'local') === 'prod' ? 'DBList_Server' : 'DBList';
$dbList = $configs['project'][$listName] ?? [];

// Хелпер для поиска конфига по имени БД
$findDbConf = function(?string $dbName) use ($dbList){
    if ($dbName === null) {
        // вернуть дефолтную (default_db==1) или первую
        foreach ($dbList as $it) { if (($it['default_db'] ?? 0) == 1) return $it; }
        return $dbList[0] ?? null;
    }
    foreach ($dbList as $it) {
        if (($it['name_db'] ?? null) === $dbName) return $it;
    }
    return null;
};

// Собираем уникальные dbName
$dbNames = [];
foreach ($rawItems as $ri) { $dbNames[$ri['dbName'] ?? ''] = true; }

// Получаем применённые версии для каждой БД
$appliedByDb = [];
foreach (array_keys($dbNames) as $dbNameKey) {
    $dbName = $dbNameKey !== '' ? $dbNameKey : null;
    $conf = $findDbConf($dbName);
    $map = [];
    if ($conf && (($conf['subd'] ?? '') === 'pgsql')) {
        try {
            $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $conf['server'] ?? 'postgres', '5432', $conf['name_db'] ?? 'postgres');
            $pdo = new PDO($dsn, $conf['username'] ?? 'postgres', $conf['user_password'] ?? 'postgres', [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
            // таблица может не существовать — тогда applied пустой
            try {
                foreach ($pdo->query('SELECT version, checksum FROM schema_migrations') as $row) {
                    $map[$row['version']] = $row['checksum'];
                }
            } catch (PDOException $e) {
                // ignore
            }
        } catch (PDOException $e) {
            // подключение не удалось, оставим пусто
        }
    }
    $appliedByDb[$dbNameKey] = $map;
}

// Формируем элементы
$items = [];
foreach ($rawItems as $ri) {
    $meta = $ri['meta'];
    $raw = $ri['raw'];
    $checksum = hash('sha256', $raw);
    $dbKey = $ri['dbName'] ?? '';
    $appliedMap = $appliedByDb[$dbKey] ?? [];
    $isApplied = array_key_exists($ri['version'], $appliedMap);
    $isDirty = $isApplied && ($appliedMap[$ri['version']] !== $checksum);

    // Прокидываем все поля из JSON + добавляем служебные
    $item = $meta;
    $item['version'] = $ri['version'];
    $item['name'] = $ri['name'];
    $item['transactional'] = (bool)$ri['transactional'];
    $item['dbName'] = $ri['dbName'] ?? null;
    $item['modifiedAt'] = $ri['modifiedAt'];
    $item['file'] = basename($ri['file']);
    $item['applied'] = $isApplied;
    $item['dirty'] = $isDirty;
    $items[] = $item;
}

echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);


