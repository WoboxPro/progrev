<?php

class CoreController{
    public static function getCore(){
        $directoryPath = $_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json';
        $dataFromConfig = json_decode(file_get_contents($directoryPath), true);
        return $dataFromConfig['core']['typeCore'];
    }

    static function getConfig(){
        $directoryPath = $_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json';
        $dataFromConfig = json_decode(file_get_contents($directoryPath), true);
        return $dataFromConfig;
    }

    static function getRoute(){
        $directoryPath = $_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json';
        $dataFromConfig = json_decode(file_get_contents($directoryPath), true);
        return $dataFromConfig['route'];
    }

}
