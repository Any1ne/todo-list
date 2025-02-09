const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;
const DATA_FILE = "tasks.json";

app.use(cors());
app.use(express.json());

// Завантаження завдань
const loadTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Збереження завдань
const saveTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// Отримання списку завдань
app.get("/tasks", (req, res) => {
  res.json(loadTasks());
});

// Додавання нового завдання
app.post("/tasks", (req, res) => {
  const tasks = loadTasks();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// Оновлення завдання (виконане/невиконане)
app.put("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.map((task) =>
    task.id === parseInt(req.params.id) ? { ...task, ...req.body } : task
  );
  saveTasks(tasks);
  res.json({ success: true });
});

// Видалення завдання
app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter((task) => task.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
