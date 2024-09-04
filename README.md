# taskOne

## Create Database and your tables

```
CREATE DATABASE task_one;

use task_one;

CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INT, 
    status ENUM('Pendent', 'In progress', 'Completed') DEFAULT 'Pendent',
    due_date DATETIME DEFAULT NOW(),
    FOREIGN KEY (assigned_to) REFERENCES members(id)
);


-- alteracao da tabela tasks onde nao e necessario a tabela members

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Pendent', 'In progress', 'Completed') DEFAULT 'Pendent',
    due_date DATETIME DEFAULT NOW()
);
```


