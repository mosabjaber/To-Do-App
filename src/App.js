import "./App.css";
import TodoList from "./Components/TodoList";
import { TodoContext } from "./context/TodoContext";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastProvider } from "./context/ToastContext";

let initialTodo = [
  { id: uuidv4(), title: "title", details: "loremlorem", isCompleted: false },
  {
    id: uuidv4(),
    title: "title2",
    details: "loremlorem2",
    isCompleted: false,
  },
];
function App() {
  const [todos, settodos] = useState(initialTodo);

  return (
    <ToastProvider>
      <TodoContext.Provider value={{ todos, settodos }}>
        <TodoList />
      </TodoContext.Provider>
    </ToastProvider>
  );
}

export default App;
