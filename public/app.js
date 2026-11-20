
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskList = document.getElementById("task-list");
const formMessage = document.getElementById("form-message");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");

let tasks = [];

function updateSummary() {
  const completedTasks = tasks.filter((task) => task.completed).length;

  taskCount.textContent = `${tasks.length} ${
    tasks.length === 1 ? "task" : "tasks"
  }`;

  completedCount.textContent = `${completedTasks} completed`;
  emptyMessage.hidden = tasks.length > 0;
}

function createTaskElement(task) {
  const listItem = document.createElement("li");
  listItem.className = task.completed ? "task-item completed" : "task-item";

  const taskText = document.createElement("span");
  taskText.className = "task-title";
  taskText.textContent = task.title;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.className = "complete-button";
  completeButton.textContent = task.completed ? "Undo" : "Complete";
  completeButton.addEventListener("click", () => toggleTask(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actions.append(completeButton, deleteButton);
  listItem.append(taskText, actions);

  return listItem;
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });

  updateSummary();
}

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");

    if (!response.ok) {
      throw new Error("The task list could not be loaded.");
    }

    tasks = await response.json();
    renderTasks();
  } catch (error) {
    formMessage.textContent = error.message;
  }
}

async function addTask(title) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.error || "The task could not be added.");
  }

  tasks.push(responseBody);
  renderTasks();
}

async function toggleTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("The task could not be updated.");
    }

    const updatedTask = await response.json();
    tasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );

    formMessage.textContent = "";
    renderTasks();
  } catch (error) {
    formMessage.textContent = error.message;
  }
}

async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("The task could not be deleted.");
    }

    tasks = tasks.filter((task) => task.id !== id);
    formMessage.textContent = "";
    renderTasks();
  } catch (error) {
    formMessage.textContent = error.message;
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();

  if (!title) {
    formMessage.textContent = "Enter a task before submitting.";
    return;
  }

  try {
    await addTask(title);
    taskTitle.value = "";
    formMessage.textContent = "Task added successfully.";
    taskTitle.focus();
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

loadTasks();