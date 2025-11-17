import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function TodoApp() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  // ✅ Correct backend URL
  const API = "https://react-todo-backend-production-1a01.up.railway.app";

  // ✅ Fetch all todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`);
      setTodos(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (trimmed === "") {
      alert("Please enter a valid task!");
      return;
    }

    try {
      if (editId) {
        // ✅ Update existing
        const res = await axios.put(`${API}/todos/${editId}`, { text: trimmed });
        setTodos(todos.map((todo) => (todo._id === editId ? res.data : todo)));
        setEditId(null);
        setInput("");
      } else {
        // ✅ Add new
        const res = await axios.post(`${API}/todos`, { text: trimmed });
        setTodos([...todos, res.data]);
        setInput("");
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const startEdit = (todo) => {
    setInput(todo.text);
    setEditId(todo._id);
  };

  const deleteAll = async () => {
    if (todos.length === 0) return alert("No tasks to delete!");
    try {
      await axios.delete(`${API}/todos`);
      setTodos([]);
    } catch (err) {
      console.error("Delete all failed:", err);
    }
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
