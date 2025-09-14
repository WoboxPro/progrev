<?php

abstract class RouteBase{

     function callbackEcho(string|int $value ){
        echo $value;
    }

    function callbackController(string|int $value ){
        list($className, $methodName) = explode("::", $value);
        forward_static_call_array([$className, $methodName], []);
    }
    
    static function parseString($input) {
        // Регулярное выражение для захвата имени в фигурных скобках и типа данных в конце строки
        $pattern = '/\{(.+?)\}:\s*(int|string)\s*$/';
        // Выполняем поиск по регулярному выражению
        if (preg_match($pattern, $input, $matches)) {
           // $_GET[$matches[1]] = 23;
            return [
                'name' => $matches[1], // Имя в фигурных скобках
                'type' => $matches[2]  // Тип данных (int или string)
            ];
        } else {
            return null; // Не удалось извлечь данные
        }
    }
}


class Route extends RouteBase{
    function __construct(
        public string $typeProject = "project",
        public string $pathPages = "",
        public string $nameTableRoute = ""
    ){
        if( $this->typeProject == "project"){
            $this->pathPages = "{$_SERVER['DOCUMENT_ROOT']}/pages/";
            $this->nameTableRoute = "route__route_list";
        }
        else{
            $this->pathPages = "{$_SERVER['DOCUMENT_ROOT']}/system/core/pages/";
            $this->nameTableRoute = "route__route_list_core";
        }
    }
    function callbackPage(string|int $value ){
        require_once $this->pathPages . "{$value}.php";
    }
    function callbackSelect(array $rout, $uri = 321){
        //PrintFormat::html( $_GET );
        //PrintFormat::html( $rout );
        $type = is_numeric($rout['type_callback']) ? (int)$rout['type_callback'] : $rout['type_callback'];
        match($type){
            1, "output" => $this->callbackEcho($rout['callback']),
            2, "page" => $this->callbackPage($rout['callback']),
            3, "classMethod" => $this->callbackController($rout['callback']),
            default => throw new Exception("Неизвестный тип callback: {$rout['type_callback']}")
        };
    }
    function getListMySQL( $urlInfo ){
        require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/CSMR/models/connect/ConnectDB.php";
        $db = \Core\ConnectDB::mysql();

        $query = $db -> query("SELECT * 
                                FROM {$this->nameTableRoute} 
                                WHERE param_count = {$urlInfo['countParam']}");

        $result = $query -> fetchAll(PDO::FETCH_ASSOC);

        if( count($result) == 0){
            return [
                "result" => 0,
                "error" => "noRout",
                "desc" => "Данной роута нет"
            ];
        }
        else{
            foreach($result as $index => $pointRout){
                if($pointRout['static_param'] == 1) {
                    // Проверка статических маршрутов
                    if ($pointRout['uri'] === $urlInfo['uri']) {
                        $this->callbackSelect( $pointRout );
                        return $result;
                    }
                }
                else{
                    $routeAction = false;
                    $exp = explode("/", $pointRout['uri'] );
                    for($i = 0; $i < $pointRout['param_count']; $i++){
                        $parse = self::parseString( $exp[$i] );
                        //PrintFormat::html( $exp[$i] );
                        if( empty($parse) ){
                            if( $urlInfo['exp'][$i] === $exp[$i] ){
                                if($i == $pointRout['param_count'] -1){
                                    $routeAction = true;
                                    break;
                                }
                                continue;
                            }
                            else{
                                break;
                            }
                        }
                        else{
                           // PrintFormat::html( $urlInfo );
                            if( $urlInfo['expType'][$i] == $parse['type'] ){
                                $_GET[$parse['name']] = $urlInfo['exp'][$i];
                                if($i == $pointRout['param_count'] -1){
                                    $routeAction = true;
                                    break;
                                }
                                continue;
                            }
                            else{
                                break;
                            }
                        }
                    }
                    if($routeAction == true){
                        self::callbackSelect( $pointRout );
                        break;
                    }
                }
            }
        }
        return $result;
    }
    static function go( $typeProject = "project" ){
        $routeCreate = new Route( $typeProject );
        // Получаем конфигурацию
        $configData = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json'), true);
        // Проверяем тип конфигурации
        if(isset($configData['core']['typeCore']) && $configData['core']['typeCore'] === 'json') {
            $data = $routeCreate->getListJson(URL::info());
        } else {
            $data = $routeCreate->getListMySQL(URL::info());
        }
    }

    function getListJson($urlInfo) {
        $configData = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/system/core/configs/configs.json'), true);

        $routes = $configData['route']['project'] ?? [];
        if( $this->typeProject == "core"){
            $routes = $configData['route']['core'] ?? [];
        }
       // echo "<pre>";
       // print_r( $urlInfo );
       
        $listRoutes = [];

        foreach($routes as $route){
            if($route['param_count'] == $urlInfo['countParam']){
                $listRoutes[] = $route;
            }
        }
        //print_r( $listRoutes );
        if( count($listRoutes) == 0){
            echo "404";
            return [
                "result" => 0,
                "error" => "noRout",
                "desc" => "Данной роута нет"
            ];
        }
        else{
            foreach($listRoutes as $route){
                if($route['static_param'] == 1){
                    if($route['uri'] == $urlInfo['uri']){
                        $this->callbackSelect( $route );
                        break;
                    }
                }
                else{
                    $routeAction = false;
                    $exp = explode("/", $route['uri']);
                    for($i = 0; $i < $route['param_count']; $i++){
                        $parse = self::parseString($exp[$i]);
                        if(empty($parse)){
                            if($urlInfo['exp'][$i] === $exp[$i]){
                                if($i == $route['param_count'] - 1){
                                    $routeAction = true;
                                    break;
                                }
                                continue;
                            }
                            else{
                                break;
                            }
                        }
                        else{
                            if($urlInfo['expType'][$i] == $parse['type']){
                                $_GET[$parse['name']] = $urlInfo['exp'][$i];
                                if($i == $route['param_count'] - 1){
                                    $routeAction = true;
                                    break;
                                }
                                continue;
                            }
                            else{
                                break;
                            }
                        }
                    }
                    if($routeAction == true){
                        $this->callbackSelect($route);
                        break;
                    }
                }
            }
        }
    }
}
