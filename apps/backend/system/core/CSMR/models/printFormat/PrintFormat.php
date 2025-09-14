<?php
class PrintFormat{
    static function html( $data ){

        echo "<pre>";
        print_r( $data );
        echo "</pre>";
    
    }
}