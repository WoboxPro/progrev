<?php

$directoryPath = $_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json';
$dataFromConfig = json_decode(file_get_contents($directoryPath), true);

$data = file_get_contents("php://input");
$data = json_decode($data, true);
if( $dataFromConfig['core']['typeCore'] == "json" ){
    if( isset($data['route']) && $data['route'] == "core"){
        echo json_encode( $dataFromConfig['route']['core'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS | JSON_HEX_QUOT );
    }
    else{
        echo json_encode( $dataFromConfig['route']['project'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS | JSON_HEX_QUOT );
    }
    
}
else{

    $dbHost     = '';
    $dbPort     = '3306';
    $dbUsername = '';
    $dbPassword = '';
    $dbName     = '';
    $dbTableRoute = 'route__route_list';
    $directoryPath = $_SERVER['DOCUMENT_ROOT'] . '/system/core/DB';

    $data = file_get_contents("php://input");
    $data = json_decode($data, true);
    if( isset($data['route']) && $data['route'] == "core"){
        $dbTableRoute = 'route__route_list_core';
    }

    
    $db = new PDO("sqlite:{$directoryPath}/wobox.db");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $query = $db->query("SELECT * FROM mydb");
    //print_r( $query -> fetchAll( PDO::FETCH_ASSOC ) );
    foreach($query as $k => $v){
        if( $v['type_db'] == "route project" ){
            $dbHost = $v["server"];
            $dbUsername = $v['username'];
            $dbPassword = $v['user_password'];
            $dbName = $v['name_db'];
            if( isset( $v['table_rout'] ) && $v['table_rout'] != ''){
                $dbTableRoute = $v['table_rout'];
            }
            break;
        }
    }

    $db = NULL;
    try {
        $db = new PDO(
            "mysql:host=$dbHost;port=$dbPort;dbname=$dbName", 
            $dbUsername, 
            $dbPassword, 
            array( PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8" )
        );
        // Устанавливаем режим ошибок для PDO
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = $db -> query("SELECT rl.id,
                                rl.uri,
                                rl.param_count,
                                tl.name AS type_callback,
                                rl.param_count_back,
                                rl.callback,
                                rl.type_callback as type_callback_id,
                                rl.type_api as type_api_id,
                                gl.name AS type_api,
                                ml.name AS method,
                                rl.method AS method_id,
                                rl.server AS server_id,
                                rl.path_for_page AS path_page_id,
                                rl.type_request AS type_request_id,
                                rl.description_rout AS description_rout,
                                rl.static_param AS static_param
                            FROM {$dbTableRoute} AS rl 
                            LEFT JOIN route__method__list AS ml 
                                ON rl.method = ml.id
                            LEFT JOIN route__group_list as gl
                                ON rl.type_api = gl.id
                            LEFT JOIN route__typecallback_list as tl
                                ON rl.type_callback = tl.id
                            ORDER BY rl.uri;");
        echo json_encode( $query -> fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_LINE_TERMINATORS | JSON_HEX_QUOT );
    // echo "Подключение успешно!";
    } catch (PDOException $e) {
        echo "Ошибка подключения: " . $e->getMessage();
    }
}


