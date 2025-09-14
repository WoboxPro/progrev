<?php
class Autoloader{
    
    public static function register(string $folder, string $directory = ""): void
    {
        spl_autoload_register(function ($class) use ($directory, $folder) {
            $pathRoot = "{$_SERVER['DOCUMENT_ROOT']}/system/core/{$folder}/{$directory}";
            
            foreach (scandir($pathRoot) as $target){

                if($target === '.' || $target === '..') continue;

                $path = "{$pathRoot}/{$target}";

                if(is_dir($path)){  
                    self::register(folder: $folder, directory: "{$directory}/{$target}");
                }
                elseif( preg_match("/\w+\.php$/ui", $target) && substr($target, 0, -4) == $class ){
                    require_once $path;
                    break;
                }
            }
        });
    }
}
Autoloader::register(folder: "CSMR");
Autoloader::register(folder: "migration");
//Autoloader::register(folder: "controllers");
//Autoloader::register(folder: "api");
//Autoloader::register(folder: "services");
//Autoloader::register(folder: "repositories");
//Autoloader::register(folder: "command");