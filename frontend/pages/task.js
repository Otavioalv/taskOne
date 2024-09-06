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

    await createTaskController(title, description, name);
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

    console.log(url);

    const result = await fetch(url, {
        method: "GET"
    })
    .then(async res => {
        return await res.json();
    });

    return result.list;
}


// Functions tasks lists

async function addTaskInTaskList(list) {
    list.forEach(element => {
        var classTaskItem = "";
        var classTextTask = "";
        
        const taskBar = `
            <div class="task-bar">
                <button class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
                    <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
                </button>
                
                <button onclick="updateButton(${element.id})" class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
                    <img src="../assets/images/edit-icon.svg" alt="editar" draggable="false">
                </button>
            </div>
        `;

        const divTaskItem = document.createElement('div');
        const containerTask = document.getElementById('container-task');
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

    console.log(divTaskItem);

    const formTaskUpdate = `
         <div class="task-bar">
        <button class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
            <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
        </button>
        
        <button class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
            <div class="cancel-edit"></div>
        </button>
    </div>

    <form class="form-update-task">
        <div>
            <label for="titulo">TÍTULO</label>
            <input 
                type="text" 
                id="titulo" 
                name="titulo"
                placeholder="Título"
                class="outline-none p-3 rounded-sm text-rose-600 focus:outline-rose-600 w-full"
                value="${title}"
            >
        </div>

        <div>
            <label for="nome">NOME DO MEMBRO</label>
            <input 
                type="text" 
                id="nome" 
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
                    id="pendent" 
                    type="radio"
                    value="Pendent" 
                    name="status"
                    ${status === "Pendent" ? 'checked' : ""}
                >
                
                
                <label 
                    for="pendent" 
                    class=""
                >Pendent</label>
            </div>
            
            <div class="">
                <input 
                    checked id="in-progress" 
                    type="radio" 
                    value="In progress" 
                    name="status" 
                    class=""
                    ${status === "In progress" ? 'checked' : ""}
                >
                <label 
                    for="in-progress" 
                    class=""
                >In progress</label>
            </div>

            <div class="">
                <input 
                    checked id="completed" 
                    type="radio" 
                    value="Completed" 
                    name="status" 
                    class=""
                    ${status === "Completed" ? 'checked' : ""}
                >
                <label 
                    for="completed" 
                    class=""
                >Completed</label>
            </div>
        </div>
    `
    
    divTaskItem.innerHTML = formTaskUpdate;

}




/* 

<div class="task-item bg-red-500">
                            
    <div class="task-bar">
            <button class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
                <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
            </button>
            
            <button class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
                <img src="../assets/images/edit-icon.svg" alt="editar" draggable="false">
            </button>
    </div>

    <h1 class="bg-red-600 sm:p-2 p-1 rounded">Titledddddddddddddddddddddddddddd</h1>
    <h2 class="bg-red-600 sm:p-2 p-1 rounded">member name</h2>
    <p class="bg-red-600 sm:p-2 p-1 rounded">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea corporis deleniti ipsa est minima necessitatibus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus fugit maiores nostrum cupiditate. Consequatur voluptatum voluptate recusandae, temporibus facere voluptates vero. Culpa soluta, quia ea eaque aliquam non facilis quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium quam reiciendis repellat mollitia numquam est accusamus, ex consequatur placeat impedit amet pariatur officia consequuntur voluptatem ea nemo quisquam, debitis ad?</p>
</div>



<div class="task-item bg-red-500">
    <div class="task-bar">
        <button class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
            <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
        </button>
        
        <button class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
            <div class="cancel-edit"></div>
        </button>
    </div>

    <form class="form-update-task">
        <div>
            <label for="titulo">TÍTULO</label>
            <input 
                type="text" 
                id="titulo" 
                name="titulo"
                placeholder="Título"
                class="outline-none p-3 rounded-sm text-rose-600 focus:outline-rose-600 w-full"
            >
        </div>

        <div>
            <label for="nome">NOME DO MEMBRO</label>
            <input 
                type="text" 
                id="nome" 
                name="nome"
                placeholder="Nome do membro"
                class="outline-none p-3 rounded-sm text-rose-600 focus:outline-rose-600 w-full"
            >
        </div>

        <div class="status-options">
            <label>STATUS</label>
            <div class="">
                
                <input 
                    id="pendent" 
                    type="radio"
                    value="Pendent" 
                    name="status" 
                >
                
                
                <label 
                    for="pendent" 
                    class=""
                >Pendent</label>
            </div>
            
            <div class="">
                <input 
                    checked id="in-progress" 
                    type="radio" 
                    value="In progress" 
                    name="status" 
                    class=""
                >
                <label 
                    for="in-progress" 
                    class=""
                >In progress</label>
            </div>

            <div class="">
                <input 
                    checked id="completed" 
                    type="radio" 
                    value="Completed" 
                    name="status" 
                    class=""
                >
                <label 
                    for="completed" 
                    class=""
                >Completed</label>
            </div>

        </div>

        

        <div>
            <label for="descricao">DESCRIÇÃO</label>
            <textarea 
                type="text" 
                id="descricao" 
                name="descricao"
                placeholder="Descrição"
                class="outline-none p-3 rounded-sm text-rose-600 focus:outline-rose-600 w-full"
            ></textarea>
        </div>
        <button class="bg-blue-600 hover:bg-blue-800 focus:outline-blue-600 py-2 px-3 rounded-full transition my-5 w-full">ATUALIZAR</button>
    </form>
</div>




<div class="itens-tasks">
    <div class="task-item bg-yellow-300">    
        <div class="task-bar">
            <button class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
                <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
            </button>
            
            <button class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
                <img src="../assets/images/edit-icon.svg" alt="editar" draggable="false">
            </button>
        </div>
        <h1 class="bg-yellow-400 sm:p-2 p-1 rounded">Title</h1>
        <h2 class="bg-yellow-400 sm:p-2 p-1 rounded">member name</h2>
        <p class="bg-yellow-400 sm:p-2 p-1 rounded">Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt magni sint veritatis natus, consequatur, autem soluta nostrum qui est aspernatur voluptate deleniti, dolores labore omnis at! Sit nostrum eaque deserunt! ipsum dolor sit amet consectetur, adipisicing elit. Ea corporis deleniti ipsa est minima necessitatibus.</p>
    </div>
</div>

 <div class="itens-tasks">
    <div class="task-item bg-green-400">    
        <div class="task-bar">
            <button class="bg-red-600 hover:bg-red-700 transition p-1 rounded">
                <img src="../assets/images/bin.svg" alt="lixeira" draggable="false">
            </button>
            
            <button class="bg-blue-600 hover:bg-blue-700 transition p-1 rounded">
                <img src="../assets/images/edit-icon.svg" alt="editar" draggable="false">
            </button>
        </div>
        <h1 class="bg-green-600 sm:p-2 p-1 rounded">Title</h1>
        <h2 class="bg-green-600 sm:p-2 p-1 rounded">member name</h2>
        <p class="bg-green-600 sm:p-2 p-1 rounded">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea corporis deleniti ipsa est minima necessitatibus. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus, numquam maiores. Numquam voluptate sequi unde nostrum dicta ratione id, nam error temporibus saepe. Quaerat natus consequuntur accusantium mollitia vel modi. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum, nihil ullam fugiat velit eaque fugit accusantium. Quibusdam aliquid obcaecati, delectus quia eaque voluptates corporis aliquam quidem tempore, sit voluptatum reprehenderit?</p>
    </div>
</div>
*/
