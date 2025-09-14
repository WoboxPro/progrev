<?php
class DB{
    static function addJSON( $data = [] ){

        $directoryPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/configs/configs.json";
        $dataFromConfig = json_decode(file_get_contents($directoryPath), true);
        // print_r( $data );
        $dataForConfig = [
            "id" => null,
            "name_db" => $data['base'],
            "username" => $data['user'],
            "user_password" => $data['password'],
            "server" => $data['server'],
            "type_db" => $data['type'],
            "desc_db" => "База для проекта",
            "subd" => "mysql",
            "status_db" => null,
            "default_db" => 1,
            "group_db" => 1
        ];
        $dataFromConfig['project']['DBList'][] = $dataForConfig;
        file_put_contents($directoryPath, json_encode($dataFromConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
    static function addSQLite( $data = [] ){
        $directoryPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/DB";
        $db = new PDO("sqlite:{$directoryPath}/wobox.db");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

 
        // [server] => localhost
        // [user] => root
        // [password] => 
        // [port] => 
        // [base] => hello
        print_r( $data );

        $db -> query("INSERT INTO mydb_project (
            `name_db`, 
            `username`, 
            `user_password`, 
            `server`, 
            `type_db`, 
            `desc_db`, 
            `subd`, 
            `default_db`, 
            `group_db`)
        VALUES (
            '{$data['base']}',
            '{$data['user']}',
            '{$data['password']}',
            '{$data['server']}',
            '1',
            'Основная база проекта',
            'mysql',
            '1',
            '1'
        )");

        echo 555;
    }
    static function add(){
        $data = file_get_contents("php://input");
        $data = json_decode($data, true);

        if( $data['type'] == "json" ){
            self::addJSON( $data);
        }
        else{
            self::addSQLite( $data );
        }

    }
}

DB::add();