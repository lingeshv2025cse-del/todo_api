const TODO_API_URL = "/todos";
const USER_API_URL = "/users";
let currentTaskFilter = "all";
let allTodos = [];

function getLoggedInUser() {
    const user = localStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
}

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

function ensureLoggedIn() {
    const user = getLoggedInUser();
    if (!user) {
        window.location.href = "login.html";
        return null;
    }
    return user;
}

function formatDate(dateString) {
    if (!dateString) {
        return "No due date";
    }
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString();
}

function isTaskOverdue(todo) {
    if (!todo.dueDate || todo.completed) {
        return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
}

function filterTasks(todos) {
    const searchTerm = document.getElementById("taskSearchInput")?.value.trim().toLowerCase() || "";
    const dueDate = document.getElementById("taskDateFilter")?.value || "";
    const priority = document.getElementById("taskPriorityFilter")?.value || "";

    return todos.filter(todo => {
        const matchesStatus = currentTaskFilter !== "uncompleted" || !todo.completed;
        const matchesSearch = !searchTerm || (todo.task || "").toLowerCase().includes(searchTerm);
        const matchesDate = !dueDate || todo.dueDate === dueDate;
        const matchesPriority = !priority || (todo.priority || "MEDIUM").toUpperCase() === priority;
        return matchesStatus && matchesSearch && matchesDate && matchesPriority;
    });
}

function renderFilteredTodos() {
    displayTodos(filterTasks(allTodos));
}

function updateFilterButton() {
    const button = document.getElementById("taskFilterBtn");
    if (!button) return;

    button.textContent = currentTaskFilter === "uncompleted" ? "Show All Tasks" : "Show Uncompleted";
}

function toggleTaskFilter() {
    currentTaskFilter = currentTaskFilter === "uncompleted" ? "all" : "uncompleted";
    updateFilterButton();
    renderFilteredTodos();
}

async function createTodo() {
    const input = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const priorityInput = document.getElementById("priorityInput");
    const completedInput = document.getElementById("completedInput");

    const task = input.value.trim();
    if (task === "") {
        alert("Please enter a task");
        return;
    }

    try {
        const user = ensureLoggedIn();
        if (!user) {
            return;
        }

        const response = await fetch(`${TODO_API_URL}/createTodo?userId=${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                task: task,
                dueDate: dueDateInput.value || null,
                priority: priorityInput.value,
                completed: completedInput.checked,
                orderIndex: 9999
            })
        });
        if (!response.ok) {
            throw new Error("Failed to create task");
        }
        input.value = "";
        dueDateInput.value = "";
        priorityInput.value = "MEDIUM";
        completedInput.checked = false;
        getAllTodos();
    } catch (error) {

        console.error(error);

        alert("Unable to create task");
    }
}
async function getAllTodos() {
    const user = ensureLoggedIn();
    if (!user) {
        return;
    }

    try {
        const response = await fetch(`${TODO_API_URL}/getTodo?userId=${user.id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
        const todos = await response.json();
        allTodos = todos;
        renderFilteredTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to load tasks");
    }
}

async function loadRegisteredUserCount() {
    const countElement = document.getElementById("registeredUserCount");
    if (!countElement) {
        return;
    }

    try {
        const response = await fetch(`${USER_API_URL}/count`);
        if (!response.ok) {
            throw new Error("Failed to fetch registered user count");
        }
        countElement.textContent = await response.text();
    } catch (error) {
        console.error(error);
        countElement.textContent = "—";
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
        const overdue = isTaskOverdue(todo);
        div.className = `todo-item ${todo.completed ? "completed" : ""} ${overdue ? "overdue" : ""}`.trim();
        div.draggable = true;
        div.dataset.id = todo.id;
        div.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", String(todo.id));
        });
        div.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        div.addEventListener("drop", async (event) => {
            event.preventDefault();
            const draggedId = Number(event.dataTransfer.getData("text/plain"));
            const targetId = Number(todo.id);
            if (!draggedId || !targetId || draggedId === targetId) {
                return;
            }
            await reorderTodo(draggedId, targetId);
        });
        div.innerHTML = `
            <div class="task-content">
                <span class="task-text ${todo.completed ? "line-through" : ""}">
                    ${todo.task}
                </span>
                <div class="task-meta">
                    <span><strong>Due:</strong> ${formatDate(todo.dueDate)}</span>
                    <span><strong>Priority:</strong> ${todo.priority || "MEDIUM"}</span>
                    <span><strong>Status:</strong> ${todo.completed ? "Completed" : overdue ? "Overdue" : "Pending"}</span>
                </div>
            </div>
            <div class="todo-actions">
                <label class="status-toggle">
                    <input type="checkbox" ${todo.completed ? "checked" : ""} onchange="toggleTodoStatus(${todo.id}, this.checked)">
                    Done
                </label>
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
async function toggleTodoStatus(id, isCompleted) {
    try {
        const user = ensureLoggedIn();
        if (!user) {
            return;
        }

        const response = await fetch(`${TODO_API_URL}/getTodo?userId=${user.id}`);
        const todos = await response.json();
        const selectedTask = todos.find(todo => todo.id === id);

        if (!selectedTask) {
            return;
        }

        const updateResponse = await fetch(`${TODO_API_URL}/updateTodo/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                task: selectedTask.task,
                dueDate: selectedTask.dueDate,
                priority: selectedTask.priority || "MEDIUM",
                completed: isCompleted
            })
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update task status");
        }

        getAllTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to update task status");
    }
}
async function updateTodo(id) {
    try {
        const user = ensureLoggedIn();
        if (!user) {
            return;
        }

        const response = await fetch(`${TODO_API_URL}/getTodo?userId=${user.id}`);
        const todos = await response.json();
        const selectedTask = todos.find(todo => todo.id === id);

        if (!selectedTask) {
            alert("Task not found");
            return;
        }

        const newTask = prompt("Enter the updated task name:", selectedTask.task || "");
        if (newTask === null) {
            return;
        }
        if (newTask.trim() === "") {
            alert("Task cannot be empty");
            return;
        }

        const dueDate = prompt("Enter the updated due date (yyyy-mm-dd) or leave blank:", selectedTask.dueDate || "");
        const priority = prompt("Enter priority (LOW, MEDIUM, HIGH):", selectedTask.priority || "MEDIUM");
        const completedText = prompt("Is this task completed? (true/false):", String(Boolean(selectedTask.completed)));

        let parsedDueDate = null;
        if (dueDate && dueDate.trim() !== "") {
            parsedDueDate = dueDate.trim();
        }

        const normalizedPriority = (priority && priority.trim() !== "") ? priority.trim().toUpperCase() : (selectedTask.priority || "MEDIUM");
        const completed = completedText && completedText.trim().toLowerCase() === "true";

        const updateResponse = await fetch(`${TODO_API_URL}/updateTodo/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                task: newTask.trim(),
                dueDate: parsedDueDate,
                priority: normalizedPriority,
                completed: completed
            })
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update task");
        }

        getAllTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to update task");
    }
}
async function reorderTodo(draggedId, targetId) {
    const user = ensureLoggedIn();
    if (!user) {
        return;
    }

    try {
        const response = await fetch(`${TODO_API_URL}/reorderTodo?userId=${user.id}&draggedId=${draggedId}&targetId=${targetId}`, {
            method: "PUT"
        });

        if (!response.ok) {
            throw new Error("Failed to reorder tasks");
        }

        getAllTodos();
    } catch (error) {
        console.error(error);
        alert("Unable to reorder tasks");
    }
}

async function deleteTodo(id) {
    const confirmDelete =
        confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) {
        return;
    }
    try {
        const user = ensureLoggedIn();
        if (!user) {
            return;
        }

        const response = await fetch(`${TODO_API_URL}/deleteTodo/${id}?userId=${user.id}`, {
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

document.addEventListener("DOMContentLoaded", () => {
    const user = ensureLoggedIn();
    if (!user) {
        return;
    }
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) {
        const username = user.username || "";
        const displayName = username.charAt(0).toUpperCase() + username.slice(1);
        welcomeText.textContent = `Welcome ${displayName}`;
    }
    updateFilterButton();
    ["taskSearchInput", "taskDateFilter", "taskPriorityFilter"].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener(id === "taskSearchInput" ? "input" : "change", renderFilteredTodos);
    });
    document.getElementById("clearTaskFiltersBtn").addEventListener("click", () => {
        document.getElementById("taskSearchInput").value = "";
        document.getElementById("taskDateFilter").value = "";
        document.getElementById("taskPriorityFilter").value = "";
        currentTaskFilter = "all";
        updateFilterButton();
        renderFilteredTodos();
    });
    loadRegisteredUserCount();
    getAllTodos();
});