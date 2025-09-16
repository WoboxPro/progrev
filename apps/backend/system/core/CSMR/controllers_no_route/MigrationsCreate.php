<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

try {
    $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bad JSON']);
    exit;
}

$name = trim((string)($input['name'] ?? ''));
if ($name === '' || !preg_match('/^[a-zA-Z0-9_\-]+$/', $name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid name']);
    exit;
}

$description = trim((string)($input['description'] ?? ''));
$dbName = trim((string)($input['dbName'] ?? ''));
$hasDbName = $dbName !== '';
$hasDbName or ($dbName = null);
$requires = array_values(array_filter(array_map('trim', (array)($input['requiresExtensions'] ?? []))));
$transactional = (bool)($input['transactional'] ?? true);
$up = array_values(array_filter(array_map('trim', (array)($input['up'] ?? []))));
$down = array_values(array_filter(array_map('trim', (array)($input['down'] ?? []))));

$version = date('Ymd_His');
$payload = [
    'version' => $version,
    'name' => $name,
    'description' => $description,
    'transactional' => $transactional,
    'requiresExtensions' => $requires,
    'up' => $up,
    'down' => $down,
    'dbName' => $dbName,
];

$dir = $_SERVER['DOCUMENT_ROOT'] . '/system/migragion';
@mkdir($dir, 0777, true);
$path = sprintf('%s/%s__%s.json', $dir, $version, $name);

file_put_contents($path, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

echo json_encode(['success' => true, 'file' => basename($path)]);


