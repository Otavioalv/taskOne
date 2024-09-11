const URL = "http://localhost/taskone/backend/tasks.php";

window.addEventListener('DOMContentLoaded', async() => {
    const list = await listTaskController();
    addTaskInTaskList(list);
});

async function getValuesFormTask(e) {
    e.preventDefault(); 

    const form = document.getElementById('taskForm');
    const formData = new FormData(form);

    const title = formData.get('titulo');
    const description = formData.get('descricao');
    const name = formData.get('nome');

    if(!title || !description || !name) {
        alert("Preencha os campos corretamente!!!");
        return;
    }

    await createTaskController(title, description, name);
}

async function getValuesFormUpdate(e, id) {
    e.preventDefault();

    const form = document.getElementById(`taskFormUpdate-${id}`);
    const formData = new FormData(form);

    const title = formData.get('titulo');
    const description = formData.get('descricao');
    const name = formData.get('nome');
    const status = formData.get(`status-${id}`);

    if(!title || !description || !name || !status) {
        alert("Preencha os campos corretamente!!!");
        return;
    }

    await updateTaskController(title, description, name, status, id);
}


// Controllers functions

async function createTaskController(title, description, name) {
    const paramsUrl = `?title=${title.trim()}&description=${description.trim()}&member_name=${name.trim()}`;
    const url = URL + paramsUrl;

    const result = await fetch(url, {
        method: 'POST',
    })
    .then(async res => {
        return await res.json();
    })

    const list = await listTaskController();
    addTaskInTaskList(list);
}

async function listTaskController(id="") {
    let url = URL;
    if(id)
        url = url + "?id=" + id;

    const result = await fetch(url, {
        method: "GET"
    })
    .then(async res => {
        return await res.json();
    });

    return result.list;
}

async function updateTaskController(title, description, name, status, id) {
    
    const paramsUrl = `?id=${id}&title=${title.trim()}&description=${description.trim()}&member_name=${name.trim()}&status=${status}`;
    const url = URL + paramsUrl;

    const result = await fetch(url, {
        method: 'PUT',
    })
    .then(async res => {
        return await res.json();
    })

    const list = await listTaskController();
    addTaskInTaskList(list);
}

async function deleteTaskController(id) {
    const paramsUrl = `?id=${id}`;
    const url = URL + paramsUrl;

    const result = await fetch(url, {
        method: 'DELETE',
    })
    .then(async res => {
        return await res.json();
    })

    const list = await listTaskController();
    addTaskInTaskList(list);
}   


// Functions tasks lists

async function addTaskInTaskList(list) {
    const containerTask = document.getElementById('container-task');
    
    containerTask.querySelector("#pendent-column").innerHTML = `<h2>Pendent</h2><div class="itens-tasks" id="itens-tasks"></div>`;
    containerTask.querySelector("#inprogress-column").innerHTML = `<h2>In progress</h2><div class="itens-tasks" id="itens-tasks">`;
    containerTask.querySelector("#completed-column").innerHTML = `<h2>Completed</h2><div class="itens-tasks" id="itens-tasks"></div>`;

    list.forEach(element => {
        var classTaskItem = "";
        var classTextTask = "";
        
        const taskBar = `
            <div class="task-bar">
                <button onclick="deleteTaskController(${element.id})" class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
                    <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
                </button>
                
                <button onclick="updateButton(${element.id})" class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
                    <img src="../assets/images/edit-icon.svg" alt="editar" draggable="false">
                </button>
            </div>
        `;

        const divTaskItem = document.createElement('div');
        
        var insertColumn;
        
        if(element.status === "Pendent"){
            classTaskItem = `task-item bg-red-500`;
            classTextTask = "bg-red-600 sm:p-2 p-1 rounded";
            insertColumn = containerTask.querySelector("#pendent-column");
        } else if(element.status === "In progress") {
            classTaskItem = `task-item bg-yellow-300`;
            classTextTask = "bg-yellow-400 sm:p-2 p-1 rounded";
            insertColumn = containerTask.querySelector("#inprogress-column");
        } else if(element.status === "Completed"){
            classTaskItem = `task-item bg-green-400`;
            classTextTask = "bg-green-600 sm:p-2 p-1 rounded";
            insertColumn = containerTask.querySelector("#completed-column");
        }


        const itensTask = insertColumn.querySelector('#itens-tasks');

        divTaskItem.className = classTaskItem;
        divTaskItem.id = `task-item-${element.id}`;

        const infoTask = `
            <h1 class="${classTextTask}">${element.title}</h1>
            <h2 class="${classTextTask}">${element.member_name}</h2>
            <p class="${classTextTask}">${element.description}</p>
        `;

        divTaskItem.innerHTML = taskBar + infoTask;
        itensTask.appendChild(divTaskItem);
    });
}

async function updateButton(id) {
    const list = await listTaskController(id);
    const divTaskItem = document.getElementById(`task-item-${id}`);
    
    const title = list[0].title;
    const description = list[0].description;
    const name = list[0].member_name;
    const status = list[0].status;


    const formTaskUpdate = `
         <div class="task-bar">
        <button onclick="deleteTaskController(${id})" class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
            <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
        </button>
        
        <button onclick="returnTaskCard(${id})" class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
            <div class="cancel-edit"></div>
        </button>
    </div>

    <form class="form-update-task" id="taskFormUpdate-${id}">
        <div>
            <label for="titulo-${id}">TÍTULO</label>
            <input 
                type="text" 
                id="titulo-${id}" 
                name="titulo"
                placeholder="Título"
                class="outline-none p-3 rounded-sm text-rose-600 focus:outline-rose-600 w-full"
                value="${title}"
            >
        </div>

        <div>
            <label for="nome-${id}">NOME DO MEMBRO</label>
            <input 
                type="text" 
                id="nome-${id}" 
                name="nome"
                placeholder="Nome do membro"
                class="outline-none p-3 rounded-sm text-rose-600 focus:outline-rose-600 w-full"
                value="${name}"
            >
        </div>

        <div class="status-options">
            <label>STATUS</label>
            <div class="">
                
                <input 
                    id="pendent-${id}" 
                    type="radio"
                    value="Pendent" 
                    name="status-${id}"
                    ${status === "Pendent" ? 'checked' : ''}
                >
                
                
                <label 
                    for="pendent-${id}" 
                    class=""
                >Pendent</label>
            </div>
            
            <div class="">
                <input 
                    id="in-progress-${id}" 
                    type="radio" 
                    value="In progress" 
                    name="status-${id}" 
                    ${status === "In progress" ? 'checked' : ""}
                >
                <label 
                    for="in-progress-${id}" 
                    class=""
                >In progress</label>
            </div>

            <div class="">
                <input 
                    id="completed-${id}" 
                    type="radio" 
                    value="Completed" 
                    name="status-${id}" 
                    ${status === "Completed" ? 'checked' : ""}
                >
                <label 
                    for="completed-${id}" 
                    class=""
                >Completed</label>
            </div>

             <div>
                <label for="descricao-${id}">DESCRIÇÃO</label>
                <textarea 
                    type="text" 
                    id="descricao-${id}" 
                    name="descricao"
                    placeholder="Descrição"
                    class="outline-none p-3 rounded-sm text-rose-600 focus:outline-rose-600 w-full"
                >${description}</textarea>
            </div>

            <button onclick="getValuesFormUpdate(event, ${id})" class="bg-blue-600 hover:bg-blue-800 focus:outline-blue-600 py-2 px-3 rounded-full transition my-5 w-full">ATUALIZAR</button>
        </div>
    `
    
    divTaskItem.innerHTML = formTaskUpdate;
}

async function returnTaskCard(id) {
    const taskItem = document.getElementById(`task-item-${id}`);
    const list = await listTaskController(id);
    
    const title = list[0].title;
    const description = list[0].description;
    const name = list[0].member_name;
    const status = list[0].status;



    const taskBar = `
        <div class="task-bar">
            <button class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
                <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
            </button>
            
            <button onclick="updateButton(${id})" class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
                <img src="../assets/images/edit-icon.svg" alt="editar" draggable="false">
            </button>
        </div>
    `;

    if(status === "Pendent"){
        classTextTask = "bg-red-600 sm:p-2 p-1 rounded";
    } else if(status === "In progress") {
        classTextTask = "bg-yellow-400 sm:p-2 p-1 rounded";
    } else if(status === "Completed"){
        classTextTask = "bg-green-600 sm:p-2 p-1 rounded";
    }  

    const infoTask = `
        <h1 class="${classTextTask}">${title}</h1>
        <h2 class="${classTextTask}">${name}</h2>
        <p class="${classTextTask}">${description}</p>
    `;

    taskItem.innerHTML = taskBar + infoTask;
}
