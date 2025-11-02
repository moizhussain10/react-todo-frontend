import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function TodoApp() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const API ="https://react-todo-backend-production-1942.up.railway.app.railway.app";
  // Fetch all todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API);
    setTodos(res.data);
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (trimmed === "") {
      alert("Please enter a valid task!");
      return;
    }

    if (editId) {
      // UPDATE existing task
      try {
        const res = await axios.put(`${API}/${editId}`, { text: trimmed });

        setTodos(
          todos.map((todo) =>
            todo._id === editId ? res.data : todo
          )
        );
        setEditId(null);
        setInput("");
      } catch (err) {
        console.error("Update failed:", err);
      }
    } else {
      // ADD new task
      const res = await axios.post(API, { text: trimmed });
      setTodos([...todos, res.data]);
      setInput("");
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const startEdit = (todo) => {
    setInput(todo.text);
    setEditId(todo._id);
  };

  const deleteAll = async () => {
    if (todos.length === 0) return alert("No tasks to delete!");
    await axios.delete(API);
    setTodos([]);
  };

  return (
    <div className="app">
      <h1>Todo List</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a task..."
      />

      <button onClick={handleSubmit}>
        {editId ? "Update Task" : "Add Task"}
      </button>
      <button className="delete-all" onClick={deleteAll}>
        Delete All
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.text}
            <div>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              <button onClick={() => startEdit(todo)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
