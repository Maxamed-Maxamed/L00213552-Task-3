const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

let tasks = [];
let nextTaskId = 1;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "L00213552 Task Assignment",
  });
});

app.get("/api/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const title =
    typeof req.body.title === "string" ? req.body.title.trim() : "";

  if (!title) {
    return res.status(400).json({
      error: "A task title is required.",
    });
  }

  const task = {
    id: nextTaskId,
    title,
    completed: false,
  };

  nextTaskId += 1;
  tasks.push(task);

  return res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      error: "Task not found.",
    });
  }

  task.completed = !task.completed;

  return res.status(200).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: "Task not found.",
    });
  }

  tasks.splice(taskIndex, 1);

  return res.status(204).send();
});

module.exports = app;
