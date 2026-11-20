let tasks = [];
let nextTaskId = 1;

function getTasks() {
  return tasks;
}

function createTask(title) {
  const cleanTitle = typeof title === "string" ? title.trim() : "";

  if (!cleanTitle) {
    throw new Error("A task title is required.");
  }

  const task = {
    id: nextTaskId,
    title: cleanTitle,
    completed: false,
  };

  nextTaskId += 1;
  tasks.push(task);

  return task;
}

function toggleTask(id) {
  const task = tasks.find((item) => item.id === Number(id));

  if (!task) {
    return null;
  }

  task.completed = !task.completed;
  return task;
}

function deleteTask(id) {
  const taskIndex = tasks.findIndex((item) => item.id === Number(id));

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
}

function resetTasks() {
  tasks = [];
  nextTaskId = 1;
}

module.exports = {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
  resetTasks,
};