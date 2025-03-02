import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext.tsx";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
          <ToastContainer />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
