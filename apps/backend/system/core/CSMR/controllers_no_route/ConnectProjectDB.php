<?php
class ConnectProjectDB{
    static function checkConnectDB( $data ){
        try {
            // Попытка подключения к базе данных
            $dsn = "{$data['subd']}:host={$data['server']};dbname={$data['name_db']}";
            $username = $data['username'];
            $password = $data['user_password'] ?? '';
            
            $pdo = new PDO($dsn, $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // Если подключение успешно, вернуть true
            return true;
        } catch (PDOException $e) {
            // Если ошибка, вернуть false и ошибку
            return false;
        }
    }
    static function go(){
        $result = [];
        $postData = json_decode(file_get_contents("php://input"), true);

        // We check the request type, but the core logic now resides here, not in the frontend.
        if(isset($postData['type']) && $postData['type'] == "json"){
            $configPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/configs/configs.json";
            $config = json_decode(file_get_contents($configPath), true);

            $devTypePath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/configs/typeDev.json";
            $dbListName = 'DBList'; // Default to 'local'
            if (file_exists($devTypePath)) {
                $devTypeContent = json_decode(file_get_contents($devTypePath), true);
                if (isset($devTypeContent['status']) && $devTypeContent['status'] === 'prod') {
                    $dbListName = 'DBList_Server';
                }
            }
            $result = $config['project'][$dbListName] ?? [];

        } else {
            $directoryPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/DB";
            $db = new PDO("sqlite:{$directoryPath}/wobox.db");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = $db->query("SELECT * FROM mydb_project");
            $result = $query -> fetchAll( PDO::FETCH_ASSOC );
        }
        

        // EXAMPLE $result::
        // [
        //     {
        //         "id": 1,
        //         "name_db": "woboxframe",
        //         "username": "root",
        //         "user_password": null,
        //         "server": "localhost",
        //         "type_db": "route core",
        //         "desc_db": "Основной роутинг ядра",
        //         "subd": "mysql",
        //         "status_db": null,
        //         "default_db": null,
        //         "group_db": 1,
        //         "table_rout": "route__route_list_core"
        //     },
        //     {
        //         "id": 2,
        //         "name_db": "woboxframe",
        //         "username": "root",
        //         "user_password": null,
        //         "server": "localhost",
        //         "type_db": "route project",
        //         "desc_db": "Основной роутинг проекта",
        //         "subd": "mysql",
        //         "status_db": null,
        //         "default_db": null,
        //         "group_db": 2,
        //         "table_rout": null
        //     }
        // ]

        $checkedDBs = [];
        foreach($result as $key => &$value){
            $isConnected = self::checkConnectDB($value);
            $value['connection_status'] = $isConnected ? 'Connected' : 'Failed';
            $checkedDBs[] = $value;
        }


        echo json_encode( $result );
      //  echo json_encode($checkedDBs);
      //  echo "<pre>";
       // print_r( $checkedDBs );
        
    }
}

ConnectProjectDB::go();