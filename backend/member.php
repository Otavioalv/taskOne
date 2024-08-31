<?php 

// CRUD

// Connection to the database
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

function f_parrams_to_member() {
    $data = array(
        'name' => $_GET['name'],
        'id' => $_GET['id'] ?? 0
    );

    return $data;
}

// CREATE
function f_create_member() {
    try {
        $member = f_parrams_to_member();
        $name = $member['name'];

        $sql = "INSERT INTO members(name) VALUES('$name')";
        
        $conn = f_connection();

        if(!$conn->query($sql) === TRUE) {
            $conn->close();
            throw new Exception("Error when creating new member");
        }

        $response = array(
            "message" => "Member created successfully",
            "status" => 201
        );

        $conn->close();
        print(json_encode($response));
        
    } catch(Exception $e) {
        $response = array(
            "message" => $e->getMessage(),
            "status" => 500
        );

        print(json_encode($response));
    }
}

// READ
function f_list_member() {
    try {
        $queryWhere = " WHERE ";
        $firstParam = true;  
        $paramGet = array_keys($_GET);

        foreach($paramGet as $param) {
            if(!$firstParam) 
                $queryWhere .= " AND ";
            
            $firstParam = false;
            $queryWhere .= "$param = $_GET[$param]";
        }

        $sql = "SELECT id, name from members";
        if($queryWhere != " WHERE ")
            $sql .= $queryWhere;


        $conn = f_connection();
        $result = $conn->query($sql);

        if($result->num_rows > 0) {
            $jsonMembersArr = [];
            $cont = 0;

            while($register = $result->fetch_assoc()) {
                $jsonMember = [];
                $jsonMember["id"] = $register["id"];
                $jsonMember["name"] = $register["name"];

                $jsonMembersArr[$cont++] = $jsonMember;
            }
        }

        $response = array(
            "list" => $jsonMembersArr,
            "status" => 200
        );

        print(json_encode($response));
    }catch(Exception $e) {
        $response = array(
            "message" => $e->getMessage() ?? 'Error whern listing members',
            "status" => 500
        );

        print(json_encode($response));
    }
}

// UPDATE
function f_update_member(){
    try {
        $member = f_parrams_to_member();
        $name = $member['name'];
        $id = $member['id'];

        $sql = "UPDATE members SET name = '$name' WHERE id = $id";

        $conn = f_connection();
        if(!$conn->query($sql) === TRUE) {
            $conn->close();
            throw new Exception("Erro when updating member");
        }

        $response = array(
            "message" => "Member updates successfully",
            "status" => 200
        );

        $conn->close();
        print(json_encode($response));
        
    } catch(Exception $e) {
        $response = array(
            "message" => $e->getMessage(),
            "status" => 500
        );

        print(json_encode($response));
    }
}

function f_delete_member(){
    try {
        $id = $_GET['id'];

        $sql = "DELETE FROM members WHERE id = $id";

        $conn = f_connection();
        if(!$conn->query($sql) === TRUE) {
            $conn->close();
            throw new Exception("Erro when deleting member");
        }

        $response = array(
            "message" => "Member successfully deleted",
            "status" => 200
        );

        $conn->close();
        print(json_encode($response));
        
    } catch(Exception $e) {
        $response = array(
            "message" => $e->getMessage(),
            "status" => 500
        );

        print(json_encode($response));
    }
}

function f_start() {
    // server based on http methods
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case "GET":
            f_list_member();
            break;
        case "POST":
            f_create_member();
            break;
        case "PUT":
            f_update_member();
            break;
        case "DELETE":
            f_delete_member();
            break;
        default: 
            print("Metodo desconhecido");
            break;
    };
}

f_start();