import React, { useState, useEffect } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import "./todo.css";

function HomePage() {
  const [todo, setTodo] = useState("");
  const [Todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);

  // Get current user token for identifying unique todos
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    userId = decoded.id;
  }

  const storageKey = `todos_${userId}`; // Unique key per user

  useEffect(() => {
    const todoString = localStorage.getItem(storageKey);
    if (todoString) {
      const todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, [storageKey]);

  const toggleFinished = () => setshowFinished(!showFinished);

  const saveToLS = (newTodos) => {
    localStorage.setItem(storageKey, JSON.stringify(newTodos));
  };

  const handleEdit = (e, id) => {
    let t = Todos.filter((i) => i.id === id);
    setTodo(t[0].todo);
    let newTodos = Todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (e, id) => {
    const newTodos = Todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleAdd = () => {
    const newTodos = [...Todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);
  };

  const handleChange = (e) => setTodo(e.target.value);

  const handlecheckbox = (e) => {
    const id = e.target.name;
    const index = Todos.findIndex((item) => item.id === id);
    const newTodos = [...Todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  return (
    <div className="homepage-container">
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}
      >
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      <div className="heading1 heading-1">
        <h1>Organize Your Daily Tasks</h1>
        <div className="addtodo">
          <h2>Add a Todo</h2>
          <div className="container">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className="text"
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 1}
              className="add"
            >
              Save
            </button>
          </div>
        </div>
        <input
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
          className="finished"
        />{" "}
        Show Finished
        <h2>Your Todos</h2>
        <div className="todos">
          {Todos.length === 0 && <div className="m-5">No todos to display</div>}

          {Todos.map(
            (item) =>
              (showFinished || !item.isCompleted) && (
                <div
                  key={item.id}
                  className="todo flex w-1/4 my-3 justify-between flex-nowrap"
                >
                  <input
                    name={item.id}
                    onChange={handlecheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                    className="checkbox"
                  />
                  <div
                    id="list"
                    className={item.isCompleted ? "line-through" : ""}
                  >
                    {item.todo}
                  </div>
                  <div className="buttons">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className="-add"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="-add"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
