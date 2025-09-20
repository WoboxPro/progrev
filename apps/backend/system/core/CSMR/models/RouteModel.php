<?php
class RouteModel{
    // Array
    // (
    //     [uri] => 
    //     [countParam] => 0
    //     [countParamBack] => 0
    //     [callback] => 
    //     [typeCallback] => 1
    //     [createFile] => 
    //     [typeApi] => 1
    //     [method] => 1
    //     [server] => 1
    //     [folderPage] => 1
    //     [typeRequest] => 1
    //     [desc] => 
    //     [addDocumentation] => 
    // )
    static function createRouteJSON( $data ){
        echo 321;
        $configData = CoreController::getConfig();
        echo 321;
        $data['uri'] = trim( $data['uri'], '/');
        $dataForConfig = [
            'uri' => str_replace('\/', '/', $data['uri']),
            'method' => 1,
            'param_count' => $data['countParam'],
            'type_callback' => $data['typeCallback'],
            'callback' => $data['callback'],
            'type_api' => $data['typeApi'],
            'param_count_back' => $data['countParamBack'],
            'path_for_page' => str_replace('\\', '/', $data['folderPage']),
            'server' => $data['server'],
            'type_request' => $data['typeRequest'],
            'description_rout' => $data['desc'],
            'static_param' => strpos($data['uri'], '{') !== false ? 0 : 1
        ];

        $configData['route']['project'][] = $dataForConfig;
        $configData = json_encode( $configData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
        file_put_contents( $_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json', $configData );
        if($data['createFile']){
            $path = "{$_SERVER['DOCUMENT_ROOT']}/pages/";
            $fullPath = $path . $data['callback'] . ".php";
            
            // Создаем директорию если она не существует
            $dirname = dirname($fullPath);
            if (!is_dir($dirname)) {
                mkdir($dirname, 0777, true);  // true для рекурсивного создания
            }
            
            // Создаем файл
            fopen($fullPath, "a+");
        }
        echo "create";
    }
    static function createRoute( $data ){
        $dataFromConfig = CoreController::getCore();
        if( $dataFromConfig == "json" ){
            RouteModel::createRouteJSON( $data );
            echo "create";
            return;
        }


        require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/CSMR/models/connect/ConnectDB.php";
        $db = \Core\ConnectDB::mysql();
        $position = strpos($data['uri'], '{');
        $data['uri'] = trim( $data['uri'], '/');
        $staticParam = 1;
        if ($position !== false) {
            $staticParam = 0;
        }
        $db -> query("INSERT INTO `route__route_list`
                    (
                        `uri`,
                        `method`,
                        `param_count`,
                        `type_callback`,
                        `callback`,
                        `type_api`,
                        `param_count_back`,
                        `path_for_page`,
                        `server`,
                        `type_request`,
                        `description_rout`,
                        `static_param`
                    )
                    VALUES(
                        '{$data['uri']}',
                        1,
                        '{$data['countParam']}',
                        '{$data['typeCallback']}',
                        '{$data['callback']}',
                        '{$data['typeApi']}',
                        '{$data['countParamBack']}',
                        '{$data['folderPage']}',
                        '{$data['server']}',
                        '{$data['typeRequest']}',
                        '{$data['desc']}',
                        $staticParam)
        ");
        if($data['createFile']){
            $path = "{$_SERVER['DOCUMENT_ROOT']}/pages/";
            $fullPath = $path . $data['callback'] . ".php";
            
            // Создаем директорию если она не существует
            $dirname = dirname($fullPath);
            if (!is_dir($dirname)) {
                mkdir($dirname, 0777, true);  // true для рекурсивного создания
            }
            
            // Создаем файл
            fopen($fullPath, "a+");
        }
        echo "create";

    }

    static function updateRoute( $data ){
        echo "update";
        require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/CSMR/models/connect/ConnectDB.php";
        $db = \Core\ConnectDB::mysql();
        $position = strpos($data['uri'], '{'); 
            $staticParam = 1;
            if ($position !== false) {
                $staticParam = 0;
            }
            $db->query("UPDATE `route__route_list`
            SET 
                `uri` = '{$data['uri']}',
                `method` = 1,
                `param_count` = '{$data['countParam']}',
                `type_callback` = '{$data['typeCallback']}',
                `callback` = '{$data['callback']}',
                `type_api` = '{$data['typeApi']}',
                `param_count_back` = '{$data['countParamBack']}',
                `path_for_page` = '{$data['folderPage']}',
                `server` = '{$data['server']}',
                `type_request` = '{$data['typeRequest']}',
                `description_rout` = '{$data['desc']}',
                `static_param` = $staticParam
            WHERE uri = '{$data['uriOld']}' AND method = 1");
    }

    static function deleteRouteJSON( $data ){
        $configData = CoreController::getConfig();
        $targetUri = isset($data['uri']) ? $data['uri'] : (isset($data['uriOld']) ? $data['uriOld'] : '');
        $targetUri = trim($targetUri, '/');
        $targetParamCount = isset($data['countParam']) ? (int)$data['countParam'] : null;

        // Работает только с проектными маршрутами
        $projectRoutes = $configData['route']['project'] ?? [];

        $filtered = [];
        foreach ($projectRoutes as $route) {
            $routeUri = isset($route['uri']) ? trim($route['uri'], '/') : '';
            $routeParamCount = isset($route['param_count']) ? (int)$route['param_count'] : null;

            $matchByUri = ($routeUri === $targetUri);
            $matchByCount = ($targetParamCount === null) ? true : ($routeParamCount === $targetParamCount);

            if (!($matchByUri && $matchByCount)) {
                $filtered[] = $route;
            }
        }

        $configData['route']['project'] = array_values($filtered);
        $configData = json_encode($configData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json', $configData);
        echo "delete";
    }

    static function deleteRoute( $data ){
        $dataFromConfig = CoreController::getCore();
        if ($dataFromConfig == "json") {
            RouteModel::deleteRouteJSON($data);
            return;
        }
        echo "not_supported";
    }
}