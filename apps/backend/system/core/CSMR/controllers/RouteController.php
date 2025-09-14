<?php
    require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/Autoloader.php";

    class RouteController{
        static function go(){
            $data = DataPage::getData();
            print_r( $data );
            $result = match( $_SERVER['REQUEST_METHOD'] ){
                "POST" => RouteModel::createRoute( $data ),
                "PUT" => RouteModel::updateRoute( $data )
            };
        }

        
    }
