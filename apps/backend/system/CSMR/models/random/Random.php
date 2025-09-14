<?php
class Random{
    static public function str(int $length, bool $md5){
        $a = "";
        $start = microtime(true);
        
        for($i = 0; $i<$length; $i++){
            $act = mt_rand(0,2);
            if($act == 0){
                $r= random_int(65, 90);
                $a .= chr($r);
            }
            elseif($act == 2){
                $r= random_int(97, 122);
                $a .= chr($r);
            }
            else{
                $r = random_int(0,9);
                $a .= $r;
            }
        
        }
        if($md5 == true){
            $md5 = md5(microtime());
            $finish = microtime(true);
            return $a = $a.$md5;
        }
        else{
            return $a;
        }
    }
}

