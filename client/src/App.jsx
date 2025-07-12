import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register.jsx"
import Login from "./components/Login.jsx";
import Home from "./pages/Home.jsx"
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";

// Kiểm tra token
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Component bảo vệ route
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      {isAuthenticated() && <Navbar user ={user}/>}

      <Routes>
        {/* Public routes */}
        <Route
          path="/register"
          element={
            isAuthenticated() ? <Navigate to="/home" /> : <Register />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/home" /> : <Login setUser={setUser}  />
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
  

        {/* Mặc định chuyển hướng */}
        <Route
          path="*"
          element={
            isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
