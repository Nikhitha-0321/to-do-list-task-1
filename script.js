
// ===============================
// TO-DO LIST APPLICATION
// script.js
// ===============================

// Elements
const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const search = document.getElementById("search");
const filters = document.querySelectorAll(".filter");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const themeBtn = document.getElementById("themeBtn");

// Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// -------------------------------
// Save
// -------------------------------
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// -------------------------------
// Statistics
// -------------------------------
function updateStats() {

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;
}

// -------------------------------
// Render Tasks
// -------------------------------
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        let statusMatch =
            currentFilter === "all" ||
            (currentFilter === "completed" && task.completed) ||
            (currentFilter === "pending" && !task.completed);

        let searchMatch =
            task.name.toLowerCase().includes(
                search.value.toLowerCase()
            );

        return statusMatch && searchMatch;
    });

    filteredTasks.forEach((task, index) => {

        let li = document.createElement("li");
        li.className = "task";

        if (task.completed)
            li.classList.add("completed");

        li.innerHTML = `

        <div class="left">

            <input
            type="checkbox"
            ${task.completed ? "checked" : ""}
            onchange="toggleTask(${index})">

            <div>

                <h3 class="task-name">
                ${task.name}
                </h3>

                <p>

                ${task.category}

                |

                <span class="${task.priority.toLowerCase()}">
                ${task.priority}
                </span>

                |

                ${task.date}

                </p>

            </div>

        </div>

        <div class="actions">

        <button
        class="edit"
        onclick="editTask(${index})">

        ✏️

        </button>

        <button
        class="delete"
        onclick="deleteTask(${index})">

        🗑️

        </button>

        </div>

        `;

        taskList.appendChild(li);

    });

    updateStats();
}

// -------------------------------
// Add Task
// -------------------------------
addTaskBtn.addEventListener("click", () => {

    if (taskInput.value.trim() === "") {

        alert("Please enter a task.");

        return;
    }

    tasks.push({

        name: taskInput.value,

        category: category.value || "General",

        priority: priority.value || "Medium",

        date: dueDate.value || "No Date",

        completed: false

    });

    saveTasks();

    renderTasks();

    taskInput.value = "";

    category.value = "";

    priority.value = "";

    dueDate.value = "";

});

// -------------------------------
// Delete
// -------------------------------
function deleteTask(index) {

    if (confirm("Delete this task?")) {

        tasks.splice(index, 1);

        saveTasks();

        renderTasks();

    }

}

// -------------------------------
// Complete
// -------------------------------
function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();

    renderTasks();

}

// -------------------------------
// Edit
// -------------------------------
function editTask(index) {

    let task = tasks[index];

    let newTask = prompt("Edit Task", task.name);

    if (newTask === null)
        return;

    if (newTask.trim() === "")
        return;

    task.name = newTask;

    let newCategory = prompt(
        "Category",
        task.category
    );

    if (newCategory)
        task.category = newCategory;

    let newPriority = prompt(
        "Priority (High/Medium/Low)",
        task.priority
    );

    if (newPriority)
        task.priority = newPriority;

    let newDate = prompt(
        "Due Date",
        task.date
    );

    if (newDate)
        task.date = newDate;

    saveTasks();

    renderTasks();

}

// -------------------------------
// Search
// -------------------------------
search.addEventListener("keyup", renderTasks);

// -------------------------------
// Filters
// -------------------------------
filters.forEach(button => {

    button.addEventListener("click", () => {

        filters.forEach(btn =>
            btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();

    });

});

// -------------------------------
// Dark Mode
// -------------------------------
let darkMode =
    localStorage.getItem("darkMode");

if (darkMode === "enabled") {

    document.body.classList.add("dark");

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem(
            "darkMode",
            "enabled"
        );

    } else {

        localStorage.setItem(
            "darkMode",
            "disabled"
        );

    }

});

// -------------------------------
// Enter Key
// -------------------------------
taskInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {

        addTaskBtn.click();

    }

});

// -------------------------------
// Initial Load
// -------------------------------
renderTasks();