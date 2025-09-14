<?
### Класс позволяет получить данные, либо как то их дополнительно обработать.
// тут можно получить данные которые были отправленные через fetch / axios и прочее
class DataPage{

    static function getData(int $type = 1):array|string{

        if(file_get_contents("php://input")){
            $data = file_get_contents("php://input");
        }
        else{
            $data = "{\"result\": 0}";
        }
        if($type === 1){
            return $data = json_decode($data, true);
        }
        else{
            return $data;
        }

    }
}