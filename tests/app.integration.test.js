const request = require("supertest");
const app = require("../src/app");
const { resetTasks } = require("../src/taskService");

describe("Task API integration tests", () => {
  beforeEach(() => {
    resetTasks();
  });

  test("GET /health returns the application status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "healthy",
      service: "L00213552 Task Assignment",
    });
  });

  test("GET /api/tasks initially returns an empty list", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /api/tasks creates a task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Run integration tests" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      title: "Run integration tests",
      completed: false,
    });
  });

  test("POST /api/tasks rejects an empty title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "   " });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "A task title is required.",
    });
  });

  test("PATCH /api/tasks/:id completes an existing task", async () => {
    const createResponse = await request(app)
      .post("/api/tasks")
      .send({ title: "Scan the Docker image" });

    const updateResponse = await request(app)
      .patch(`/api/tasks/${createResponse.body.id}`);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.completed).toBe(true);
  });

  test("PATCH /api/tasks/:id returns 404 for a missing task", async () => {
    const response = await request(app).patch("/api/tasks/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Task not found.",
    });
  });

  test("DELETE /api/tasks/:id removes an existing task", async () => {
    const createResponse = await request(app)
      .post("/api/tasks")
      .send({ title: "Delete this task" });

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${createResponse.body.id}`);

    const listResponse = await request(app).get("/api/tasks");

    expect(deleteResponse.status).toBe(204);
    expect(listResponse.body).toEqual([]);
  });

  test("DELETE /api/tasks/:id returns 404 for a missing task", async () => {
    const response = await request(app).delete("/api/tasks/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "Task not found.",
    });
  });
});