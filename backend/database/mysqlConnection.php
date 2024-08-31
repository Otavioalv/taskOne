<?php 

// Cria a conexão com o banco de dados
function f_connection() {
    // connection data
    $server = "127.0.0.1";
    $user = "root";
    $passwd = "123456";
    $database = "task_one";

    // create connection
    try {
        $conn = new mysqli($server, $user, $passwd, $database);

        return $conn;
    } catch(Exception $e) {
        throw new Exception("Error creating connection to database");
    }
}