<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$dir = $_SERVER['DOCUMENT_ROOT'] . '/system/migragion'; // по просьбе пользователя
@mkdir($dir, 0777, true);

$items = [];
foreach (glob($dir . '/*__*.json') as $file) {
    $basename = basename($file);
    if (!preg_match('/^([0-9]{8}_[0-9]{6})__([^.]+)\.json$/', $basename, $m)) continue;
    $raw = file_get_contents($file);
    $meta = json_decode($raw, true) ?: [];
    $items[] = [
        'version' => $meta['version'] ?? $m[1],
        'name' => $meta['name'] ?? $m[2],
        'transactional' => (bool)($meta['transactional'] ?? true),
        'dbName' => $meta['dbName'] ?? null,
        'modifiedAt' => date('Y-m-d H:i:s', filemtime($file)),
        'file' => $basename,
    ];
}

echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);


