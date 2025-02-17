require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query(
  `CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  task_name VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
);

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tasks");
  }
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Task text is required" });

  try {
    const result = await pool.query(
      "INSERT INTO tasks (task_name) VALUES ($1) RETURNING *",
      [text]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding task");
  }
});

app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating task");
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting task");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
