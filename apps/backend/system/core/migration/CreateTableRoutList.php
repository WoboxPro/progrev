<?php
$connectMySQL = [
    "dbHost" => "localhost",
    "dbPort" => "3306",
    "dbUsername" => "root",
    "dbPassword" => "",
    "dbName" => "fa"
];

$db = NULL;

    $db = new PDO(
        "mysql:host={$connectMySQL['dbHost']};port={$connectMySQL['dbPort']};dbname={$connectMySQL['dbName']}", 
        $connectMySQL['dbUsername'], 
        $connectMySQL['dbPassword'], 
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
    );
    // Устанавливаем режим ошибок для PDO
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db -> query("create table roles
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
    ");


