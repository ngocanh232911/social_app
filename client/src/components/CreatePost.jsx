import React, { useState } from "react";
import "../styles/CreatePost.css";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // Xử lý file upload
  const handleFileChange = (e) => {
    setError("");
    setUrl("");
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check loại file (ảnh/video)
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/ogg",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Chỉ cho phép upload ảnh (jpg, png, gif) hoặc video (mp4, webm, ogg)");
        return;
      }
      setFile(selectedFile);

      // Preview file
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Xử lý nhập url
  const handleUrlChange = (e) => {
    setError("");
    setFile(null);
    setUrl(e.target.value);

    // Preview từ url
    const val = e.target.value.trim();
    if (val.match(/\.(jpeg|jpg|png|gif)$/i)) {
      setPreview(val);
    } else if (val.match(/\.(mp4|webm|ogg)$/i)) {
      setPreview(val);
    } else {
      setPreview(null);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", text);

      if (file) {
        formData.append("image", file);
      } else if (url.trim()) {
        formData.append("imageUrl", url.trim());
      }

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setText("");
        setFile(null);
        setUrl("");
        setPreview(null);
        setError("");
        if (onPostCreated) onPostCreated(data);
      } else {
        setError(data.message || "Đăng bài thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <form className="create-post-form fade-in-up" onSubmit={handleSubmit}>
      <textarea
        placeholder="Bạn đang nghĩ gì?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        required
      />
      <div className="input-group">
        <label className="file-label">
          📁 Chọn file ảnh/video
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        </label>

        <input
          type="text"
          placeholder="Hoặc dán link ảnh/video"
          value={url}
          onChange={handleUrlChange}
        />
      </div>

      {preview && (
        <div className="preview-container">
          {preview.match(/\.(mp4|webm|ogg)$/i) ? (
            <video controls src={preview} className="preview-media" />
          ) : (
            <img src={preview} alt="preview" className="preview-media" />
          )}
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="submit-btn pop">
        🚀 Đăng bài
      </button>
    </form>
  );
};

export default CreatePost;
