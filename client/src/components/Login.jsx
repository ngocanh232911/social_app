import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 thêm dòng này
import "../styles/Login.css";

const Login = ({setUser}) => {
  const navigate = useNavigate(); // 👈 khởi tạo navigate

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("userId", data.user._id); // 
 
        setUser(data.user); // 👈 Cập nhật user để Navbar dùng

        navigate("/home"); // 👈 chuyển sang trang home (bạn có thể đổi thành bất kỳ path nào)
      } else {
        setMessage(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert(err.message);
      setMessage("Cannot connect to server. Please try again later. 😢");
    }
  };

  return (
    <div className="login-container fade-in-up">
      <h2 className="login-title pop">💖 Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="login-btn pop" type="submit">
          ✨ Login
        </button>
      </form>
      {message && <p className="login-error fade-in-up">{message}</p>}
    </div>
  );
};

export default Login;
