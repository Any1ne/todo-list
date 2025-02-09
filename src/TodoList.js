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
    <div className="p-4 max-w-md mx-auto bg-black text-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4 text-blue-400">ToDo List</h1>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-grow rounded-l bg-gray-800 text-white border-blue-500"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r"
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <ul>
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center p-2 border-b border-gray-700"
          >
            <span
              className={`cursor-pointer ${
                t.completed ? "line-through text-gray-500" : "text-white"
              }`}
              onClick={() => toggleTask(t.id)}
            >
              {t.text}
            </span>
            <button
              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
              onClick={() => deleteTask(t.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
