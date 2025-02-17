import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/tasks";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (task.trim() === "") return;
    const newTask = { text: task, completed: false };
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    setTask("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div>
      <h1>ToDo List</h1>
      <div class="AddTodoItem">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul class="TodoList">
        {tasks.map((t) => (
          <li class="TodoItem" key={t.id}>
            <div>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(t.id)}
              />
              <span>{t.task_name}</span>
            </div>
            <button onClick={() => deleteTask(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
