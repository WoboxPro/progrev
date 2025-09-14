<?php
header('Content-Type: application/json; charset=utf-8');

/**
 * API endpoint to update the development status.
 * Reads the new status from a POST request and updates typeDev.json.
 */

$configPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/configs/typeDev.json";

// --- Basic Security and Request Validation ---

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Требуется метод POST.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Некорректный JSON в теле запроса.']);
    exit;
}

if (!isset($input['status'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'В запросе отсутствует обязательное поле "status".']);
    exit;
}

if (!file_exists($configPath)) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Файл конфигурации typeDev.json не найден.']);
    exit;
}

// --- Read, Validate, and Write ---

$config = json_decode(file_get_contents($configPath), true);
$newStatus = $input['status'];

// Validate if the new status is in the list of allowed types
if (isset($config['typeDevList']) && is_array($config['typeDevList']) && !in_array($newStatus, $config['typeDevList'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Передано недопустимое значение статуса.']);
    exit;
}

// Update the status
$config['status'] = $newStatus;

// Write the changes back to the file
// Using JSON_PRETTY_PRINT to keep the file readable
if (file_put_contents($configPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(['success' => true, 'message' => 'Статус разработки успешно обновлен на ' . $newStatus]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Не удалось записать изменения в файл. Проверьте права доступа.']);
} 