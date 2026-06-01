let currentFilter = "all";

let searchTerm = "";

const totalTasks =
    document.querySelector("#total-tasks");

const activeTasks =
    document.querySelector("#active-tasks");

const completedTasks =
    document.querySelector("#completed-tasks");

const searchInput =
    document.querySelector("#search-input");

const taskInput =
    document.querySelector("#task-input");

const addTaskBtn =
    document.querySelector("#add-task-btn");

const taskList =
    document.querySelector("#task-list");

let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];

renderTasks();

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const exists = tasks.some(task =>
        task.text.toLowerCase() ===
        taskText.toLowerCase()
    );

    if (exists) {
        alert("Task already exists");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);

function renderTasks() {


    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(task =>
            !task.completed
        );

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task =>
            task.completed
        );

    }

    filteredTasks = filteredTasks.filter(task =>
        task.text
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    taskList.innerHTML = "";
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
        <div class="empty-state">
            <h3>No tasks found</h3>
            <p>Add a task to get started.</p>
        </div>
    `;

        updateStats();

        return;
    }

    filteredTasks.sort((a, b) => {

    return a.completed - b.completed;

});

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
    <span class="${task.completed ? 'completed' : ''}">
        ${task.text}
    </span>

    <div>
        <button class="complete-btn">
            ${task.completed ? 'Undo' : 'Done'}
        </button>

        <button class="delete-btn">
            Delete
        </button>
    </div>
`;
        taskList.appendChild(li);
        const deleteBtn =
            li.querySelector(".delete-btn");

        const completeBtn =
            li.querySelector(".complete-btn");

        deleteBtn.addEventListener("click", () => {

            deleteTask(task.id);

        });

        completeBtn.addEventListener("click", () => {

            toggleTask(task.id);

        });

    });

    updateStats();

}

function deleteTask(id) {

    tasks = tasks.filter(task =>
        task.id !== id
    );

    saveTasks();
    renderTasks();

}

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();

}

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}
function updateStats() {

    totalTasks.textContent =
        tasks.length;

    activeTasks.textContent =
        tasks.filter(task =>
            !task.completed
        ).length;

    completedTasks.textContent =
        tasks.filter(task =>
            task.completed
        ).length;

}
const filterButtons =
    document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();

    });

});

const clearCompletedBtn =
    document.querySelector("#clear-completed");

clearCompletedBtn.addEventListener("click", () => {

    tasks = tasks.filter(task =>
        !task.completed
    );

    saveTasks();
    renderTasks();

});

searchInput.addEventListener("input", () => {

    searchTerm = searchInput.value;

    renderTasks();

});

taskInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        addTask();
    }

});