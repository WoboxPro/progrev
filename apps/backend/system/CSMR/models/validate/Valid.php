<?php

final class Valid{
    static $ERROR_DESCRIPTION = [
        "min-length" => "Минимальная длина должна быть символов: ",
        "max-length" => "Макс. длина в символах должна быть:",
        "require" => "Введите символы",
        "number" => "Должно быть число",
        "email" => "Должен быть email",
        "max" => "Больше чем макс. число: ",
        "min" => "Меньше чем минимальное число: ",
        "not-number-in-string" => "Тут должен быть текст",
        "session" => "Перезайдите на сайт"
    ];
    static $errors = [];
    static function saveError(string $key, string|null $data = ""):void{
        foreach(self::$ERROR_DESCRIPTION as $k => $v){
            if($k == $key){
                self::$errors[$k] = $v . " " . $data;
                return;
            }
        }
        self::$errors[] = "Для данной ошибки еще нет описания";
    }
    
    static function config(string|int|float $data, array $rules):array{
        $errors = [];
        foreach($rules as $key => $value){
            if($key == "min-length"){
                if(mb_strlen($data) < $value){
                    self::saveError($key, $value);
                }
            }
            if($key == "max-length"){
                if(mb_strlen($data) > $value){
                    self::saveError($key, $value);

                }
            }
            if($key == "require"){
                if(empty($data)){
                    self::saveError($key);
                }
            }
            if($key == "max" ){
                if($value < $data){
                    self::saveError($key, $value);
                }
            }
            if($key == "min" ){
                if($value > $data){
                    self::saveError($key, $value);
                }
            }
            if($key == "number"){
                if(!is_numeric($data) ){
                    self::saveError($key);
                }
            }
            if($key == "email"){
                $pattern = '/^[A-Z0-9._%+-]+@([A-Z0-9-]+\.){1,3}[A-Z]{2,4}$/i';
                if(!preg_match($pattern, $data)){
                    self::saveError($key);
                }
            }
            if ($key == "phone") {
                $pattern= '/^\+[0-9]{10,15}$/i';
                if(!preg_match($pattern, $data)){
                    self::saveError($key);
                }
            }
            if($key == "ip"){

            }
            if($key == "ip4"){

            }
            if($key == "ip6"){

            }
            if($key == "json"){

            }
            if($key == "date"){
                $pattern = "/^(0[1-9]|[12][0-9]|3[01])([.,\-])(0[1-9]|1[012])([.,\-])(19[0-9]{2}|2[0-9]{3})$/i";
                $match = [];
                $res = preg_match($pattern, $data, $match);
                if(!$res){
                    self::saveError($key);
                }
                else if ($match[2] !== $match[4]) {
                    self::saveError($key);
                }
                else if(is_string($value)){
                    if($match[2] !== $value) {
                        self::saveError($key);
                    }
                }
            }
            if($key == "datetime" || $key == "timestamp"){

            }
            if($key == "unixtime"){

            }
            if($key == "not-number-in-string"){
                if(is_numeric($data)){
                    self::saveError($key);
                }
            }

            if($key == "session"){
                if(!isset($_SESSION['id']) OR @session_id() != $_SESSION['sid']){
                    self::saveError($key);
                }

            }
        }
        // [
        //     "min-length" => "",
        //     "max-length" => "",
        //     "require" => "",
        //     "max" => "",
        //     "min" => "",
        //     "number" => "",
        //     "email" => "",
        //     "ip" => "",
        //     "ip4" => "",
        //     "ip6" => "",
        //     "json" => "",
        //     "date" => "",
        //     "datetime" => "",
        //     "timestamp" => "",
        //     "unixtime" => ""
        // ]

        if(count(self::$errors) === 0){
            return [
                "result" => 1,
                "errors" => self::$errors,
                "status" => "Ошибок нет"
                
            ];
        }
        else{
            return [
                "result" => 0,
                "errors" => self::$errors,
                "status" => "Ошибок: " . count(self::$errors)
            ];
        }

    }
    static function noCode($data){
        $data = trim($data);
        return strip_tags($data);
    }

    static function sessionTrue(){
        if(!isset($_SESSION['id'])){
            return json_encode([
                "result" => 0,
                "desc" => "Сеанс сессии истек, перезайдите на сайт"
            ]);
        
            
        }

        if(@session_id() != $_SESSION['sid'] ){
            return json_encode([
                "result" => "0",
                "desc" => "Нарушение прав доступа"
            ]);
        }
    }
}


//$valid = Valid::config("",[
//    "min-length" => 5,
//    "max-length" => 10,
//    "require" => true,
//    "max" => 2,
//    "min" => 4
//]);


//
//echo "<pre>";
//print_r($valid);


