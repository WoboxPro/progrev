<?php
if (!file_exists("{$_SERVER['DOCUMENT_ROOT']}/system/core/DB/wobox.db")) {
    $pdo = new PDO("sqlite:{$_SERVER['DOCUMENT_ROOT']}/system/core/DB/wobox.db"); 
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Создаем таблицу, если её нет
    $sql = <<<SQL
            create table mydb
            (
                id            INTEGER
                    primary key autoincrement,
                name_db       TEXT,
                username      TEXT,
                user_password TEXT,
                server        TEXT,
                type_db       TEXT,
                desc_db       TEXT    null on conflict ignore,
                subd          TEXT    null on conflict ignore,
                status_db     integer null on conflict ignore,
                default_db    integer null on conflict ignore,
                group_db      integer null on conflict ignore,
                table_rout    TEXT
            );

            create table mydb_project
            (
                id            integer,
                name_db       text,
                username      text,
                user_password text,
                server        text,
                type_db       text,
                desc_db       text,
                subd          text,
                status_db     integer,
                default_db    integer,
                group_db      integer
            );

            create table type_db
            (
                id        INTEGER
                    primary key autoincrement,
                name_type TEXT
            );
    SQL;
    $pdo->exec($sql);
}
?>