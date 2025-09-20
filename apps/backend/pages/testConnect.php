<?php
try {
    $db = ConnectDB::pgsql('postgres');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->query('SELECT 1'); // ок — значит коннект жив
    echo 'OK';
  } catch (PDOException $e) {
    echo 'DB error: ' . $e->getMessage();
  }

?>

