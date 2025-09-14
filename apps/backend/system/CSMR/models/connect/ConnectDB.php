<?php
//require_once $_SERVER['DOCUMENT_ROOT']."/system/config/settingConnectDB.php";

class ConnectDB{
    public static $connectMysql;

    /**
     * Reads and returns the core configuration from the JSON file.
     * @return array|null The decoded JSON configuration as an associative array, or null on failure.
     */
    private static function getCoreConfig(): ?array
    {
        $configPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/configs/configs.json";
        if (!file_exists($configPath)) {
            return null;
        }
        $jsonContent = file_get_contents($configPath);
        return json_decode($jsonContent, true);
    }

    public static function mysql( $option = ''){
        $config = self::getCoreConfig();
        $result = [];

        if (isset($config['core']['typeCore']) && $config['core']['typeCore'] === 'json') {
            // Data source is JSON, now check for dev/prod mode
            $devTypePath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/configs/typeDev.json";
            $dbListName = 'DBList'; // Default to 'local'
            if (file_exists($devTypePath)) {
                $devTypeContent = json_decode(file_get_contents($devTypePath), true);
                if (isset($devTypeContent['status']) && $devTypeContent['status'] === 'prod') {
                    $dbListName = 'DBList_Server';
                }
            }

            $dbList = $config['project'][$dbListName] ?? [];
            // Filter only mysql databases
            foreach ($dbList as $db) {
                if (isset($db['subd']) && $db['subd'] === 'mysql') {
                    $result[] = $db;
                }
            }
        } else {
            // Data source is the database (legacy behavior)
            $directoryPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/DB";
            $db = new PDO("sqlite:{$directoryPath}/wobox.db");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = $db->query("SELECT * FROM mydb_project WHERE `subd` = 'mysql'");
            $result = $query -> fetchAll( PDO::FETCH_ASSOC );
        }

            $dsn = "";
            $username = "";
            $password = "";

            foreach($result as $key => $value){
                if( $value['default_db'] == 1 && $option == ''){
                    $dsn = "{$value['subd']}:host={$value['server']};dbname={$value['name_db']}";
                    $username = $value['username'];
                    $password = $value['user_password'] ?? '';
                    break;
                }
                elseif( $value['name_db'] == $option){
                    $dsn = "{$value['subd']}:host={$value['server']};dbname={$value['name_db']}";
                    $username = $value['username'];
                    $password = $value['user_password'] ?? '';
                    break;
                }
            }
         
            if (empty($dsn)) {
                // Fallback or error handling if no suitable DB config is found
                // For example, you could throw an exception or return null
                throw new Exception("Database configuration not found for option: '{$option}'");
            }

            return $pdo = new PDO($dsn, $username, $password);
      //     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      //  self::$connectMysql = CONNECT_MYSQL;
      // return new PDO("mysql:host=" . self::$connectMysql['dbHost'] . ";port=" . self::$connectMysql['dbPort'] . ";dbname=" . self::$connectMysql['dbName'], self::$connectMysql['dbUsername'], self::$connectMysql['dbPassword'], array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        
    }
    // static function pgsql( $option = ''){
    //     $directoryPath = "{$_SERVER['DOCUMENT_ROOT']}/system/core/DB";
    //     $db = new PDO("sqlite:{$directoryPath}/wobox.db");
    //     $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //     $query = $db->query("SELECT * FROM mydb_project WHERE `subd` = 'pgsql'");
    //     $result = $query -> fetchAll( PDO::FETCH_ASSOC );
    //         $dsn = "";
    //         $username = "";
    //         $password = "";

    //         foreach($result as $key => $value){
    //             if( $value['default_db'] == 1 && $option == ''){
    //                 $dsn = "pgsql:host={$value['server']};dbname={$value['name_db']}";
    //                 $username = $value['username'];
    //                 $password = $value['user_password'] ?? '';
    //                 break;
    //             }
    //             elseif( $value['name_db'] == $option){
    //                 $dsn = "pgsql:host={$value['server']};dbname={$value['name_db']}";
    //                 $username = $value['username'];
    //                 $password = $value['user_password'] ?? '';
    //                 break;
    //             }
    //         }
         
    //         return $pdo = new PDO($dsn, $username, $password);
    // }
    // static function postgresql(){
    //     $host = 'localhost';
    //     $db = 'postgres';
    //     $user = 'postgres';
    //     $pass = '';

    //     try {
    //         $dsn = "pgsql:host=$host;dbname=$db";
    //         $pdo = new PDO($dsn, $user, $pass);
    //         $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //         return $pdo;
    //     } catch (PDOException $e) {
    //         return "Ошибка подключения: " . $e->getMessage();
    //     }
    // }

    // static function postgresqlGeo(){
    //     $host = 'localhost';
    //     $db = 'geo';
    //     $user = 'postgres';
    //     $pass = '';

    //     try {
    //         $dsn = "pgsql:host=$host;dbname=$db";
    //         $pdo = new PDO($dsn, $user, $pass);
    //         $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //         return $pdo;
    //     } catch (PDOException $e) {
    //         return "Ошибка подключения: " . $e->getMessage();
    //     }
    // }
}
