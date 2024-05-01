import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import LogIn from "./LogIn";
import Dashboard from "./Dashboard";
import AddTeacher from "./AddTeacher";
import Students from "./Students";
import "./Assets/login-removebg-preview.png";
import { Routes } from "react-router-dom";
import { Route } from "react-router";
import UpdateModal from "./Coponents/UpdateModal";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AddTeacher" element={<AddTeacher />} />
        <Route path="/Students" element={<Students />} />
        <Route element={<UpdateModal />} />
      </Routes>
    </div>
  );
}
