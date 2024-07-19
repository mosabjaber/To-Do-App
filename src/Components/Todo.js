import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import "./Todo.css";
import { useContext } from "react";
import { TodoContext } from "../context/TodoContext";

import { useToast } from "../context/ToastContext";

export default function Todo({ todo, showDelete, showUpdate }) {
  const { todos, settodos } = useContext(TodoContext);
  const { showHideToast } = useToast();
  // const [updateTodo, setUpdateTodo] = useState({
  //   title: todo.title,
  //   details: todo.details,
  // });

  function handleCheckClick() {
    const updateTodo = todos.map((t) => {
      if (t.id === todo.id) {
        t.isCompleted = !t.isCompleted;
      }
      return t;
    });
    settodos(updateTodo);
    // save local storage
    localStorage.setItem("todos", JSON.stringify(updateTodo));
    showHideToast("Modified successfully");
  }

  function openDeleteClick() {
    showDelete(todo);
  }

  function handleUpdateClick() {
    showUpdate(todo);
  }

  return (
    <>
      <div className="todoParent">
        {" "}
        <div className="box">
          <h3
            style={{
              textDecoration: todo.isCompleted ? "line-through" : "none",
              fontWeight: "bold",
            }}
          >
            {todo.title}
          </h3>
          <h4
            style={{
              textDecoration: todo.isCompleted ? "line-through" : "none",
            }}
          >
            {todo.details}
          </h4>
        </div>
        <div className="icons">
          <IconButton
            className="iconBtn"
            aria-label="checked"
            style={{
              color: todo.isCompleted ? "#fff" : "#8bc34a",
              background: todo.isCompleted ? "#8bc34a" : "#fff",
              border: "solid 3px #8bc34a",
            }}
            onClick={() => {
              handleCheckClick();
            }}
          >
            <CheckRoundedIcon />
          </IconButton>
          <IconButton
            className="iconBtn"
            aria-label="edit"
            style={{
              color: "#1769aa",
              background: "#fff",
              border: "solid 3px #1769aa",
            }}
            onClick={() => {
              handleUpdateClick();
            }}
          >
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
          <IconButton
            className="iconBtn"
            aria-label="delete"
            style={{
              color: "#b23c17",
              background: "#fff",
              border: "solid 3px #b23c17",
            }}
            onClick={() => {
              openDeleteClick();
            }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
}
