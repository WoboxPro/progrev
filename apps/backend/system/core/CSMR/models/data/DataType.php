<?php
class DataType{
    static function json(mixed $data){
        
        return json_encode($data);
    }
}