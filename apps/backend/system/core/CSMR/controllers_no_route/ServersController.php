<?php
class ServersController{
    static function getServers(){
        $sql = "SELECT * FROM servers";
        $result = ConnectDB::query($sql);
        return $result;
    }
}
?>
