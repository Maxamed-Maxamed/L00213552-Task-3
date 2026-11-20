const {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
  resetTasks,
} = require("../src/taskService");

describe("Task service unit tests", () => {
  beforeEach(() => {
    resetTasks();
  });

  test("starts with an empty task list", () => {
    expect(getTasks()).toEqual([]);
  });

  test("creates a task with a unique ID and incomplete status", () => {
    const task = createTask("Create automated tests");

    expect(task).toEqual({
      id: 1,
      title: "Create automated tests",
      completed: false,
    });

    expect(getTasks()).toHaveLength(1);
  });

  test("removes unnecessary whitespace from a task title", () => {
    const task = createTask("  Build Docker image  ");

    expect(task.title).toBe("Build Docker image");
  });

  test("rejects an empty task title", () => {
    expect(() => createTask("   ")).toThrow(
      "A task title is required."
    );
  });

  test("rejects a missing task title", () => {
    expect(() => createTask()).toThrow(
      "A task title is required."
    );
  });

  test("changes a task from incomplete to complete", () => {
    const task = createTask("Configure AWS deployment");
    const updatedTask = toggleTask(task.id);

    expect(updatedTask.completed).toBe(true);
  });

  test("returns null when updating a task that does not exist", () => {
    expect(toggleTask(999)).toBeNull();
  });

  test("deletes an existing task", () => {
    const task = createTask("Temporary task");

    expect(deleteTask(task.id)).toBe(true);
    expect(getTasks()).toEqual([]);
  });

  test("returns false when deleting a task that does not exist", () => {
    expect(deleteTask(999)).toBe(false);
  });

  test("assigns a different ID to each task", () => {
    const firstTask = createTask("First task");
    const secondTask = createTask("Second task");

    expect(firstTask.id).toBe(1);
    expect(secondTask.id).toBe(2);
  });
});