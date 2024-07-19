import { createContext, useState, useContext } from "react";
import MysnackBar from "../Components/MysnackBar";

const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  function showHideToast(message) {
    setOpen(true);
    setMessage(message);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }
  return (
    <ToastContext.Provider value={{ showHideToast }}>
      <MysnackBar open={open} message={message} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
