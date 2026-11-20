const express = require("express");
const path = require("path");
const {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} = require("./taskService");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "L00213552 Task Assignment",
  });
});

app.get("/api/tasks", (req, res) => {
  res.status(200).json(getTasks());
});

app.post("/api/tasks", (req, res) => {
  try {
    const task = createTask(req.body.title);
    return res.status(201).json(task);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = toggleTask(req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found.",
    });
  }

  return res.status(200).json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const deleted = deleteTask(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      error: "Task not found.",
    });
  }

  return res.status(204).send();
});

module.exports = app;