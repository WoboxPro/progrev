<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$host = getenv('DB_HOST') ?: 'postgres';
$port = getenv('DB_PORT') ?: '5432';
$dbName = getenv('DB_NAME') ?: 'app';
$user = getenv('DB_USER') ?: 'postgres';
$password = getenv('DB_PASSWORD') ?: 'postgres';

$dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s;connect_timeout=5', $host, $port, $dbName);

try {
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $version = $pdo->query('SELECT version()')->fetchColumn();

    echo json_encode([
        'ok' => true,
        'dsn' => $dsn,
        'user' => $user,
        'version' => $version,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'dsn' => $dsn,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}


