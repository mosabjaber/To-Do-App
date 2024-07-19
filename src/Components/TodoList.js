import Todo from "./Todo";
import "./TodoList.css";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, useContext, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { TodoContext } from "../context/TodoContext";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useToast } from "../context/ToastContext";

export default function TodoList() {
  const { todos, settodos } = useContext(TodoContext);
  const [titleInp, setTitleInp] = useState("");
  const [titleInp2, setTitleInp2] = useState("");
  const [displayTodosType, setDisplayTodosType] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [dialogTodo, setDialogTodo] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const { showHideToast } = useToast();

  useEffect(() => {
    const storageTodos = JSON.parse(localStorage.getItem("todos"));
    settodos(storageTodos ?? []);
  }, []);

  function handleAddClick() {
    const newTodo = {
      id: uuidv4(),
      title: titleInp,
      details: titleInp2,
      isCompleted: false,
    };
    const updateTodos = [...todos, newTodo];
    settodos(updateTodos);
    // save local storage
    localStorage.setItem("todos", JSON.stringify(updateTodos));
    setTitleInp("");
    setTitleInp2("");
    showHideToast("A task has been added successfully");
  }
  // filteration array and useing useMemo
  const completeTodos = useMemo(() => {
    return todos.filter((t) => {
      return t.isCompleted;
    });
  }, [todos]);

  const notCompleteTodos = useMemo(() => {
    return todos.filter((t) => {
      return !t.isCompleted;
    });
  }, [todos]);

  let todosToBeRenderd = todos;
  if (displayTodosType === "complete") {
    todosToBeRenderd = completeTodos;
  } else if (displayTodosType === "not-complete") {
    todosToBeRenderd = notCompleteTodos;
  } else {
    todosToBeRenderd = todos;
  }
  function ChangeDisplayTodosType(e) {
    setDisplayTodosType(e.target.value);
  }

  let todoList = todosToBeRenderd.map((t) => {
    return (
      <Todo
        key={t.id}
        todo={t}
        showDelete={showDeleteDialog}
        showUpdate={showUpdateDialog}
      />
    );
  });

  // handle function
  function handleDeleteDialogClose() {
    setDeleteDialog(false);
  }

  function showDeleteDialog(todo) {
    setDialogTodo(todo);
    setDeleteDialog(true);
  }
  function handleDeleteConfirm() {
    const updateTodo = todos.filter((t) => {
      // if (t.id !== dialogTodo.id) {
      //   return t;
      // } else {
      //   return false;
      // }
      return t.id !== dialogTodo.id;
    });
    settodos(updateTodo);
    // save local storage
    localStorage.setItem("todos", JSON.stringify(updateTodo));
    setDeleteDialog(false);
    showHideToast("A task has been delete successfully");
  }

  function handleUpdateDialogClose() {
    setUpdateDialog(false);
  }
  function handleUpdateConfirm() {
    const updateTodos = todos.map((t) => {
      if (t.id === dialogTodo.id) {
        return { ...t, title: dialogTodo.title, details: dialogTodo.details };
      } else {
        return t;
      }
    });
    settodos(updateTodos);
    setUpdateDialog(false);
    // save local storage
    localStorage.setItem("todos", JSON.stringify(updateTodos));
    showHideToast("A task has been update successfully");
  }
  function showUpdateDialog(todo) {
    setDialogTodo(todo);
    setUpdateDialog(true);
  }
  return (
    <>
      <Container maxWidth="md" className="container">
        <div className="header">
          <h1>Tasks</h1>
          <hr />
          <ToggleButtonGroup
            value={displayTodosType}
            onChange={ChangeDisplayTodosType}
            exclusive
            color="primary"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="complete">Completed</ToggleButton>
            <ToggleButton value="not-complete">Not completed</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="todo">{todoList}</div>
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          <Grid xs={4}>
            <Button
              variant="contained"
              style={{
                width: "100%",
                height: "50%",
                marginLeft: "5px",
                marginTop: "25px",
                fontWeight: "bold",
                fontSize: "20px",
              }}
              onClick={() => {
                handleAddClick();
              }}
              disabled={titleInp.length === 0 && titleInp2.length === 0}
            >
              Add
            </Button>
          </Grid>
          <Grid xs={8}>
            <TextField
              style={{ width: "100%", marginBottom: "10px" }}
              id="outlined-basic"
              label="Title Task"
              variant="outlined"
              value={titleInp}
              onChange={(e) => {
                setTitleInp(e.target.value);
              }}
            />
            <TextField
              style={{ width: "100%" }}
              id="outlined-basic1"
              label="details Task"
              variant="outlined"
              value={titleInp2}
              onChange={(e) => {
                setTitleInp2(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Container>
      {/* start delete modal */}
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteDialogClose}
        // TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure you want to delete the task?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You cannot undo the deletion after it is complete
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>close</Button>
          <Button onClick={handleDeleteConfirm}>confirm</Button>
        </DialogActions>
      </Dialog>
      {/* end delete modal */}
      {/* start edit modal */}
      <Dialog
        open={updateDialog}
        onClose={handleUpdateDialogClose}
        // TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"edit task"}</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="task title"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setDialogTodo({ ...dialogTodo, title: e.target.value });
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            label="discreption"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setDialogTodo({ ...dialogTodo, details: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose}>close</Button>
          <Button onClick={handleUpdateConfirm}>update</Button>
        </DialogActions>
      </Dialog>
      {/* end edit modal */}
    </>
  );
}
