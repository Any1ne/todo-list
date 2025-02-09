import "./App.css";
import React from "react";
import TodoList from "./TodoList";

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <TodoList />
    </div>
  );
}

export default App;
