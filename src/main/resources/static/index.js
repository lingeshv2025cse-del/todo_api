const API_URL = "/todos";
async function createTodo() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim();
    if (task === "") {
        alert("Please enter a task");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/createTodo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                task: task
            })
        });
        if (!response.ok) {
            throw new Error("Failed to create task");
        }
        input.value = "";
        getAllTodos();
    } catch (error) {

        console.error(error);

        alert("Unable to create task");
    }
}
async function getAllTodos() {
    try {
        const response = await fetch(`${API_URL}/getTodo`);
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error(error);
        alert("Unable to load tasks");
    }
}
function displayTodos(todos) {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";
    if (todos.length === 0) {
        todoList.innerHTML =
            `<p class="empty-message">No tasks available</p>`;
        return;
    }
    todos.forEach(todo => {
        const div = document.createElement("div");
        div.className = "todo-item";
        div.innerHTML = `
            <span class="task-text">
                ${todo.task}
            </span>
            <div class="todo-actions">
                <button
                    class="edit-btn"
                    onclick="updateTodo(${todo.id})">
                    Edit
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteTodo(${todo.id})">
                    Delete
                </button>
            </div>
        `;
        todoList.appendChild(div);
    });
}
async function updateTodo(id) {
    const newTask = prompt("Enter the updated task:");
    if (newTask === null) {
        return;
    }
    if (newTask.trim() === "") {
        alert("Task cannot be empty");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/updateTodo/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                task: newTask
            })
        });
        if (!response.ok) {
            throw new Error("Failed to update task");
        }
        getAllTodos();

    } catch (error) {

        console.error(error);

        alert("Unable to update task");
    }
}
async function deleteTodo(id) {
    const confirmDelete =
        confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/deleteTodo/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Failed to delete task");
        }
        getAllTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to delete task");
    }
}
getAllTodos();