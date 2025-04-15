import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientList from "./components/PatientList";
import PatientDetails from "./components/PatientDetails";
import Register from "./components/Register";
import Login from "./components/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
