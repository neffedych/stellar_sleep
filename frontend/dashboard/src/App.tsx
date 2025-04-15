import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import PatientList from "./components/PatientList";
import PatientDetails from "./components/PatientDetails";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header"; 

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const [loggedUsername, setLoggedUsername] = useState<string>("");

  const getUserFromLocalStorage = () => {
    try {
      const loggedUserStr = localStorage.getItem('user');
      if (loggedUserStr) {
        try {
          const user = JSON.parse(loggedUserStr);
          return user.username || user;
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError);
          return loggedUserStr;
        }
      }
      return "undefined";
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return "undefined";
    }
  };

  useEffect(() => {
    setLoggedUsername(getUserFromLocalStorage());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedUsername("undefined");
  };

  const WithHeaderLayout = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" />;
    }
    
    return (
      <>
        <Header userName={loggedUsername} onLogout={handleLogout} />
        {children}
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <WithHeaderLayout>
                <PatientList />
              </WithHeaderLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patients/:id" 
          element={
            <ProtectedRoute>
              <WithHeaderLayout>
                <PatientDetails />
              </WithHeaderLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;