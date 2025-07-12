import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../pages/Profile"
import "../styles/Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar fade-in-up">
      <div className="navbar-left pop">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="avatar"
          className="navbar-avatar"
        />
        <span className="navbar-name">{user?.name || "Guest"}</span>
      </div>

      <div className="navbar-links pop">
        <Link to="/">🏠 Home</Link>
        <Link to="/create">➕ Share your thoughts..."</Link>
        <Link to="/profile">👤 Your profile</Link>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
