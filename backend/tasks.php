<?php 
require "./database/mysqlConnection.php";

function f_params_to_task() {
    $data = array(
        "id" => $_GET["id"] ?? 0,
        "title" => $_GET["title"],
        "description" => $_GET["description"] ?? "",
        "status" => $_GET['status'] ?? "",
        "member_name" => $_GET["member_name"]
    );

    return $data;
}

// CRUD

// CREATE
function f_create_task() {
    try {
        $task = f_params_to_task();
        
        $title = $task['title'];
        $description = $task['description'];
        $member_name = $task['member_name'];

        $sql = "INSERT INTO tasks(title, description, member_name) values('$title', '$description', '$member_name')";
        
        $conn = f_connection();
        
        if(!$conn->query($sql) === TRUE) {
            $conn->close();
            throw new Exception("Error when creating new task");
        }

        $response = array(
            "message" => "Task created successfully",
            "status" => 201
        );
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
function f_list_task() {
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

        $sql = "SELECT id, title, description, member_name, status, due_date from tasks";
        if($queryWhere != " WHERE ")
            $sql .= $queryWhere;


        $conn = f_connection();
        $result = $conn->query($sql);

        if($result->num_rows > 0) {
            $jsonTasksArr = [];
            $cont = 0;

            while($register = $result->fetch_assoc()) {
                $jsonTask = [];
                $jsonTask["id"] = $register["id"];
                $jsonTask["title"] = $register["title"];
                $jsonTask["description"] = $register["description"];
                $jsonTask["member_name"] = $register["member_name"];
                $jsonTask["status"] = $register["status"];
                $jsonTask["due_date"] = $register["due_date"];

                $jsonTasksArr[$cont++] = $jsonTask;
            }
        }

        $response = array(
            "list" => $jsonTasksArr,
            "status" => 200
        );

        print(json_encode($response));
    }catch(Exception $e) {
        $response = array(
            "message" => $e->getMessage() ?? 'Error whern listing tasks',
            "status" => 500
        );

        print(json_encode($response));
    }
}

// UPDATE
function f_update_task() {
    try {
        $task = f_params_to_task();
        $id = $task['id'];
        $title = $task['title'];
        $description = $task['description'];
        $member_name = $task['member_name'];
        $status = $task['status'];

        $valueStatus = "";
        if($status) 
            $valueStatus = ",status = '$status'";

        $sql = "UPDATE tasks 
                SET 
                    title = '$title', 
                    description = '$description', 
                    member_name = '$member_name'
                ".$valueStatus.
                "WHERE id = $id";

        $conn = f_connection();
        if(!$conn->query($sql) === TRUE) {
            $conn->close();
            throw new Exception("Erro when updating task");
        }

        $response = array(
            "message" => "Task updates successfully",
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

// DELETE
function f_delete_task() {
    try {
        $id = $_GET['id'];

        $sql = "DELETE FROM tasks WHERE id = $id";

        $conn = f_connection();
        if(!$conn->query($sql) === TRUE) {
            $conn->close();
            throw new Exception("Erro when deleting task");
        }

        $response = array(
            "message" => "Task successfully deleted",
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
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case "GET":
            f_list_task();
            break;
        case "POST":
            f_create_task();
            break;
        case "PUT":
            f_update_task();
            break;
        case "DELETE":
            f_delete_task();
            break;
        default:
            $response = array(
                "message" => "Metodo desconhecido",
                "status" => 500
            );

            print(json_encode($response));
            break;
    }
}

f_start();
