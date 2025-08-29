import React, { useState } from "react";
import { Link } from "react-router-dom";  // ✅ thêm Link để điều hướng
import "../styles/Register.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Create account successfully! 🎉");
        window.location.href = "/login";
        setForm({ name: "", email: "", password: "" });
      } else {
        alert(`Error: ${data.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Error. Please try again.");
    }
  };

  return (
    <div className="register-container fade-in-up">
      <h2 className="title pop">🎀 Create account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name..."
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email..."
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password..."
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="register-btn pop" type="submit">
          🌸 Create account
        </button>
      </form>

      <p className="redirect-text">
        Already have an account?{" "}
        <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
};

export default Register;
