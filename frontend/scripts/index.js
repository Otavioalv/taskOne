function getValuesFormTask(e) {
    e.preventDefault();

    const form = document.getElementById('taskForm');
    const formData = new FormData(form);

    const title = formData.get('titulo');
    const description = formData.get('descricao');
    const name = formData.get('nome');

    console.log(title, description, name);
}

