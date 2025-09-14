<?php
namespace Core;
use PDO;
use PDOException;
use Exception;

class ConnectDB{

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

    public static function mysql(){
        $config = self::getCoreConfig();
        $dbConfig = null;

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
            foreach ($dbList as $db) {
                if (isset($db['default_db']) && $db['default_db'] == 1) {
                    $dbConfig = $db;
                    break;
                }
            }
        } else {
            // Data source is the database (legacy behavior)
            $directoryPath = $_SERVER['DOCUMENT_ROOT'] . '/system/core/DB';
            $db = new PDO("sqlite:{$directoryPath}/wobox.db");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = $db->query("SELECT * FROM mydb WHERE type_db = 'route project' AND default_db = '1'");
            $dbConfig = $query->fetch(PDO::FETCH_ASSOC);
        }

        if (!$dbConfig) {
            echo "Не удалось найти настройки базы данных по умолчанию. Проверьте конфигурацию ('configs.json' или 'wobox.db'). Для настройки перейдите на /wobox.php";
            exit;
        }

        $connectMysql  = [
            "dbHost"     => $dbConfig["server"],
            "dbPort"     => '3306', // Consider adding port to config as well
            "dbUsername" => $dbConfig['username'],
            "dbPassword" => $dbConfig['user_password'] ?? '',
            "dbName"     => $dbConfig['name_db']
        ];

        return new PDO("mysql:host=" . $connectMysql['dbHost'] . ";port=" . $connectMysql['dbPort'] . ";dbname=" . $connectMysql['dbName'], $connectMysql['dbUsername'], $connectMysql['dbPassword'], array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    }

    public static function sqlite(){
        try {
            $directoryPath = 'system/core/DB';
            $db = new PDO("sqlite:{$directoryPath}/wobox.db");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $db;
        } catch (PDOException $e) {
            echo "Ошибка: " . $e->getMessage();
        }
    }

    public static function testConnectMasterDB(){
        try {
            $directoryPath = 'system/core/DB';
            $db = new PDO("sqlite:{$directoryPath}/wobox.db");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo json_encode( ["result" => 1, "desc" => "Успешно"] );
        } catch (PDOException $e) {
            echo json_encode( ["result" => 0, "Ошибка" => $e->getMessage()] ); 
        }
    }

    static function allDB( array $data = []){
        $directoryPath = 'system/core/DB';
        $db = new PDO("sqlite:{$directoryPath}/wobox.db");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $query = $db->query("SELECT * FROM mydb");
        $result = $query -> fetchAll( PDO::FETCH_ASSOC );
        if( isset( $data['req'] ) == "return"){
            return $result;
        }
        else{
            echo json_encode( $result );
        }

    }
}
