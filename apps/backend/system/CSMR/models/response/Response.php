<?php

class Response{
    static function json( $data ){

        echo json_encode( $data );
    }
}