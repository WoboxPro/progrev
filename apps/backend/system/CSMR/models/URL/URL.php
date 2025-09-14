<?php
class URL{
    static function info($url = NULL):array{
        if(!isset($url)){
            // Берем REQUEST_URI и убираем GET-параметры
            $url = $_SERVER['REQUEST_URI'];
            $url = parse_url($url, PHP_URL_PATH);
        }
        $infoUrl = [];
        $infoUrl['uri'] = trim($url, "/");

        $exp = explode("/", $infoUrl['uri'] );
        if($exp[0] == null){
            $infoUrl['exp'] = null;
            $infoUrl['countParam'] = 0;
        }
        else{
            $infoUrl['exp'] = $exp;
            $infoUrl['countParam'] = count( $exp );
        }
    
        for($i = 0; $i < count($exp); $i++){
            if( is_numeric($exp[$i]) ){
                $infoUrl['expType'][$i] = "int";
            }
            else{
                $infoUrl['expType'][$i] = "string";
            }
        }

        $infoUrl['method'] = $_SERVER['REQUEST_METHOD'];
        $infoUrl['get'] = $_GET;
        if(isset($_SERVER['HTTP_HOST'])){
            $infoUrl['HTTP_HOST'] = $_SERVER['HTTP_HOST'];
        }
        if(isset($_SERVER['HTTP_REFERER'])){
            $infoUrl['HTTP_REFERER'] = $_SERVER['HTTP_REFERER'];
        }    
        if(isset($_SERVER['HTTP_SEC_CH_UA_PLATFORM'])){
            $infoUrl['HTTP_SEC_CH_UA_PLATFORM'] = $_SERVER['HTTP_SEC_CH_UA_PLATFORM'];
        }    
        if(isset($_SERVER['HTTP_USER_AGENT'])){
            $infoUrl['HTTP_USER_AGENT'] = $_SERVER['HTTP_USER_AGENT'];
        }    
        if(isset($_SERVER['HTTP_SEC_CH_UA'])){
            $infoUrl['HTTP_SEC_CH_UA'] = $_SERVER['HTTP_SEC_CH_UA'];
        }
        return $infoUrl;
    }
}