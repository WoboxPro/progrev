<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

try {
    $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bad JSON']);
    return;
}

$version = trim((string)($input['version'] ?? ''));
$name = trim((string)($input['name'] ?? ''));

if ($version === '' || $name === '' || !preg_match('/^[0-9]{8}_[0-9]{6}$/', $version) || !preg_match('/^[a-zA-Z0-9_\-]+$/', $name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid params']);
    return;
}

$dir = $_SERVER['DOCUMENT_ROOT'] . '/system/migragion';
$path = sprintf('%s/%s__%s.json', $dir, $version, $name);

if (!is_file($path)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'File not found']);
    return;
}

if (!@unlink($path)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to delete']);
    return;
}

echo json_encode(['success' => true]);
