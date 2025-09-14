<?php
require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/Autoloader.php";

class ConnectSUBD{
    static public $sqlForRouteTables = <<<SQL
        create table roles
        (
            id            int auto_increment
                primary key,
            roles_name    varchar(200)                        null,
            roles_name_en varchar(200)                        null,
            created_at    timestamp default CURRENT_TIMESTAMP null
        )
            charset = utf8mb3;

        create table route__block_roles_list
        (
            id         int auto_increment
                primary key,
            name_role  varchar(200)                        null,
            created_at timestamp default CURRENT_TIMESTAMP null,
            updated_at timestamp default CURRENT_TIMESTAMP null
        );

        create table route__blockroles_for_route
        (
            id         int auto_increment
                primary key,
            route_name varchar(200)                        null,
            route_id   int                                 null,
            role_id    int                                 null,
            created_at timestamp default CURRENT_TIMESTAMP null,
            updated_at timestamp default CURRENT_TIMESTAMP null
        );

        create table route__group_list
        (
            id         int auto_increment
                primary key,
            name       varchar(25)                         null,
            created_at timestamp default CURRENT_TIMESTAMP null
        );


        INSERT INTO route__group_list (id, name, created_at) VALUES (1, 'page', '2024-05-23 08:41:26');
        INSERT INTO route__group_list (id, name, created_at) VALUES (2, 'api', '2024-05-23 08:41:26');
        INSERT INTO route__group_list (id, name, created_at) VALUES (3, 'command', '2024-05-23 08:41:31');
        INSERT INTO route__group_list (id, name, created_at) VALUES (4, 'test', '2024-05-31 07:57:16');

        create table route__method__list
        (
            id         int auto_increment
                primary key,
            name       varchar(20)                         null,
            created_at timestamp default CURRENT_TIMESTAMP null
        );
        INSERT INTO route__method__list (id, name, created_at) VALUES (1, 'ALL', '2024-05-23 08:22:27');
        INSERT INTO route__method__list (id, name, created_at) VALUES (2, 'GET', '2024-05-23 08:22:27');
        INSERT INTO route__method__list (id, name, created_at) VALUES (3, 'POST', '2024-05-23 08:22:36');
        INSERT INTO route__method__list (id, name, created_at) VALUES (4, 'PUT', '2024-05-23 08:22:36');
        INSERT INTO route__method__list (id, name, created_at) VALUES (5, 'DELETE', '2024-05-23 08:22:41');

        create table route__path_file_list
        (
            id         int auto_increment
                primary key,
            path_file  varchar(200)                        null,
            created_at timestamp default CURRENT_TIMESTAMP null,
            updated_at timestamp default CURRENT_TIMESTAMP null
        );

        create table route__roles_for_route
        (
            id         int auto_increment
                primary key,
            route_name varchar(200)                        null,
            route_id   int                                 null,
            role_id    int                                 null,
            created_at timestamp default CURRENT_TIMESTAMP null,
            updated_at timestamp default CURRENT_TIMESTAMP null
        );

        create table route__roles_list
        (
            id         int auto_increment
                primary key,
            name_role  varchar(200)                        null,
            created_at timestamp default CURRENT_TIMESTAMP null,
            updated_at timestamp default CURRENT_TIMESTAMP null
        );

        create table route__route_list
        (
            id               int auto_increment
                primary key,
            uri              varchar(250)                        null,
            method           int                                 null,
            param_count      int                                 null,
            created_at       timestamp default CURRENT_TIMESTAMP null,
            updated_at       timestamp default CURRENT_TIMESTAMP null,
            type_callback    int                                 null,
            callback         varchar(250)                        null,
            type_api         int                                 null,
            type_first_param int                                 null,
            param_count_back int                                 null,
            path_for_page    varchar(200)                        null,
            server           int                                 null,
            type_request     int                                 null,
            description_rout varchar(250)                        null,
            static_param     int                                 null,
            auth_mark        int                                 null,
            block_roles      int                                 null,
            success_roles    int                                 null
        )
            charset = utf8mb3;

        create table route__route_list_core
        (
            id               int auto_increment
                primary key,
            uri              varchar(250)                        null,
            method           int                                 null,
            param_count      int                                 null,
            created_at       timestamp default CURRENT_TIMESTAMP null,
            updated_at       timestamp default CURRENT_TIMESTAMP null,
            type_callback    int                                 null,
            callback         varchar(250)                        null,
            type_api         int                                 null,
            type_first_param int                                 null,
            param_count_back int                                 null,
            path_for_page    varchar(200)                        null,
            server           int                                 null,
            type_request     int                                 null,
            description_rout varchar(250)                        null,
            static_param     int                                 null
        )
            charset = utf8mb3;
            INSERT INTO route__route_list_core (id, uri, method, param_count, created_at, updated_at, type_callback, callback, type_api, type_first_param, param_count_back, path_for_page, server, type_request, description_rout, static_param) VALUES (1, 'api/route', 1, 2, '2024-03-10 18:16:29', '2024-03-10 18:16:29', 3, 'RouteController::go', 1, 0, 2, null, 2, 2, 'что у вас здесь происходит?', 1);
            INSERT INTO route__route_list_core (id, uri, method, param_count, created_at, updated_at, type_callback, callback, type_api, type_first_param, param_count_back, path_for_page, server, type_request, description_rout, static_param) VALUES (18, 'api/test', 1, 2, '2024-06-15 22:03:36', '2024-06-15 22:03:36', 3, 'ConnectDB::testConnectMasterDB', 1, null, 2, null, null, 1, 'fsfe', 1);
            INSERT INTO route__route_list_core (id, uri, method, param_count, created_at, updated_at, type_callback, callback, type_api, type_first_param, param_count_back, path_for_page, server, type_request, description_rout, static_param) VALUES (19, 'api/all-db', 1, 2, '2024-06-17 11:15:12', '2024-06-17 11:15:12', 3, 'ConnectDB::allDB', 1, null, 2, null, null, 1, 'конфиги подключения у бд', 1);
            
        create table route__servers_list
        (
            id          int auto_increment
                primary key,
            server_name varchar(250)                        null,
            ip_name     varchar(60)                         null,
            domain_name varchar(200)                        null,
            created_at  timestamp default CURRENT_TIMESTAMP null,
            updated_at  timestamp default CURRENT_TIMESTAMP null
        );

        create table route__typecallback_list
        (
            id         int auto_increment
                primary key,
            name       varchar(25)                         null,
            created_at timestamp default CURRENT_TIMESTAMP null
        );
        INSERT INTO route__typecallback_list (id, name, created_at) VALUES (1, 'output', '2024-05-23 08:48:27');
        INSERT INTO route__typecallback_list (id, name, created_at) VALUES (2, 'page', '2024-05-23 08:48:27');
        INSERT INTO route__typecallback_list (id, name, created_at) VALUES (3, 'classMethod', '2024-05-23 08:48:45');
        INSERT INTO route__typecallback_list (id, name, created_at) VALUES (4, 'function', '2024-05-23 08:48:45');
        INSERT INTO route__typecallback_list (id, name, created_at) VALUES (5, 'middleware ', '2024-06-01 19:52:27');

    SQL;


    static function check(){
        $data = DataPage::getData();
        $dsn = "mysql:host={$data['server']}";  // Подключение только к серверу MySQL
        $username = $data['user'];  // Имя пользователя MySQL
        $password = $data['password'];  // Пароль пользователя MySQL

        try {
            $pdo = new PDO($dsn, $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "Connected to MySQL server successfully.";
            ////////////////////////////////////////////////// 
            $dbName = $data['base'];  // Имя создаваемой базы данных

            $result = $pdo->query("SHOW DATABASES LIKE '$dbName'");
            if ($result->rowCount() > 0) {
                
                $db = new PDO(
                    "mysql:host={$data['server']};port=3306;dbname=$dbName", 
                    $username, 
                    $password, 
                    array( PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8" )
                );
                $db -> query( self::$sqlForRouteTables );


                $directoryPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/DB";
                $db = new PDO("sqlite:{$directoryPath}/wobox.db");
                $db -> query("INSERT INTO mydb (
                    `name_db`, 
                    `username`, 
                    `user_password`, 
                    `server`, 
                    `type_db`, 
                    `desc_db`, 
                    `subd`, 
                    `default_db`, 
                    `group_db`,
                    `table_rout`)
                VALUES (
                    '{$dbName}',
                    '{$username}',
                    '{$password}',
                    '{$data['server']}',
                    'route core',
                    'Основной роутинг ядра',
                    'mysql',
                    '1',
                    '1',
                    'route__route_list_core'
                ),
                (
                    '{$dbName}',
                    '{$username}',
                    '{$password}',
                    '{$data['server']}',
                    'route project',
                    'Основной роутинг проекта',
                    'mysql',
                    '1',
                    '2',
                    NULL
                );");
                echo "Database '$dbName' exists. Create tables success";
            } else {
                try {
                    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbName");
                    echo "Database '$dbName' created successfully.";

                    // $db = $pdo->exec("USE {$dbName}");
                    // print_r( $db );

                    $db = new PDO(
                        "mysql:host={$data['server']};port=3306;dbname=$dbName", 
                        $username, 
                        $password, 
                        array( PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8" )
                    );
                    $db -> query( self::$sqlForRouteTables );


                    $directoryPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/DB";
                    $db = new PDO("sqlite:{$directoryPath}/wobox.db");
                    $db -> query("INSERT INTO mydb (
                        `name_db`, 
                        `username`, 
                        `user_password`, 
                        `server`, 
                        `type_db`, 
                        `desc_db`, 
                        `subd`, 
                        `default_db`, 
                        `group_db`,
                        `table_rout`)
                    VALUES (
                        '{$dbName}',
                        '{$username}',
                        '{$password}',
                        '{$data['server']}',
                        'route core',
                        'Основной роутинг ядра',
                        'mysql',
                        '1',
                        '1',
                        'route__route_list_core'
                    ),
                    (
                        '{$dbName}',
                        '{$username}',
                        '{$password}',
                        '{$data['server']}',
                        'route project',
                        'Основной роутинг проекта',
                        'mysql',
                        '1',
                        '2',
                        NULL
                    );");
                    
                } catch (PDOException $e) {
                    echo "Database creation failed: " . $e->getMessage();
                }
            }

            ///////////////////////////////////////////////////////////////


        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }
}

ConnectSUBD::check();