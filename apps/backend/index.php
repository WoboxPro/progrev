<?php
    session_start();

    $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? null;
    $type          = $_SERVER['HTTP_TYPEQUERY']     ?? null;

    if( $type == "core"){
        require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/Autoloader.php";
        require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/routes/routeMaster.php";
        Route::go('core');
    }
    else{
        require_once "{$_SERVER['DOCUMENT_ROOT']}/system/Autoloader.php";
        require_once "{$_SERVER['DOCUMENT_ROOT']}/system/core/routes/routeMaster.php";
        Route::go();

    }
?>
