<?php
// это контроллер самый базовый, вызывается без роута, так как на момент проверки данного контроллера, роута еще нет =) 
class CheckCoreDBController{
    static public function check(){
        $pathDB = $_SERVER['DOCUMENT_ROOT'] . "/system/core/DB/wobox.db";
        $result = file_exists($pathDB);
       // print_r( $result );
        echo json_encode( $result );
    }
}
CheckCoreDBController::check();
