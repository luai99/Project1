import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./Assets/login-removebg-preview.png";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserProvider from "./Context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);
