import React, { useEffect, useState } from "react";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData).id : null;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setForm({
          name: data.name,
          email: data.email,
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      setEditing(false);
    } else {
      alert(data.message || "Có lỗi xảy ra khi cập nhật.");
    }
  };

  return (
    <div className="profile-container fade-in-up">
      {user && !editing && (
        <div className="profile-header pop">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="avatar"
            className="profile-avatar"
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p className="profile-bio">{user.bio || "🌸 Chưa có mô tả cá nhân"}</p>
          <button className="edit-btn pop" onClick={() => setEditing(true)}>
            ✏️ Chỉnh sửa hồ sơ
          </button>
        </div>
      )}

      {editing && (
        <form className="profile-form fade-in-up" onSubmit={handleUpdate}>
          <input
            type="text"
            name="name"
            placeholder="Tên"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="avatar"
            placeholder="Link ảnh đại diện"
            value={form.avatar}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Mô tả cá nhân"
            rows={3}
            value={form.bio}
            onChange={handleChange}
          />
          <div className="form-buttons">
            <button type="submit" className="save-btn pop">
              💾 Lưu
            </button>
            <button
              type="button"
              className="cancel-btn pop"
              onClick={() => setEditing(false)}
            >
              ❌ Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
