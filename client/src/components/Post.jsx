import React, { useState } from "react";
import "../styles/Post.css";
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `http://localhost:3000${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};


// Nếu bạn chưa có riêng FollowButton thì mình để luôn ở đây
const FollowButton = ({ userId, initialFollowing, token }) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(initialFollowing);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const action = following ? "unfollow" : "follow";
      const res = await fetch(`http://localhost:3000/api/users/${userId}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFollowing(!following);
      } else {
        alert(`Không thể ${action} người dùng!`);
      }
    } catch (error) {
      alert("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`follow-btn ${following ? "following" : ""}`}
      onClick={toggleFollow}
      disabled={loading}
      style={{
        marginLeft: "auto",
        padding: "0.3rem 0.7rem",
        fontSize: "0.8rem",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        backgroundColor: following ? "#aaa" : "#ff5a71",
        color: "white",
        transition: "background-color 0.3s",
      }}
    >
      {loading ? "..." : following ? "Đã theo dõi" : "Theo dõi"}
    </button>
  );
};

const Post = ({ post, currentUserId, token, onDelete }) => {
    const imageUrl = getFullImageUrl(post.image);  // <-- ĐÚNG CHỖ NÀY

  const [liked, setLiked] = useState(post.likes.includes(currentUserId));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [deleting, setDeleting] = useState(false);

  // Comment states (nếu bạn có phần comment rồi thì giữ lại)
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Nếu backend trả isFollowing ở post.user thì dùng luôn
  // Nếu không có thì mặc định false
  const initialIsFollowing = post.user?.isFollowing || false;

  // Like/unlike toggle
  const toggleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/post/${post._id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        setLiked(!liked);
        setLikeCount((count) => (liked ? count - 1 : count + 1));
      }
    } catch (error) {
      console.error("Lỗi like/unlike:", error);
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/post/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onDelete(post._id);
      } else {
        alert("Xóa bài thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối server.");
    } finally {
      setDeleting(false);
    }
  };

  // Add comment (giữ nếu bạn có phần comment)
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/post/${post._id}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentText("");
      } else {
        alert("Thêm bình luận thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối server.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete comment (giữ nếu bạn có phần comment)
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/post/${post._id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } else {
        alert("Xóa bình luận thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối server.");
    }
  };

  return (
    <div className="post-card fade-in-up">
      <div className="post-header" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img
          src={post.user?.avatar || "/default-avatar.png"}
          alt="avatar"
          className="post-avatar"
        />
        <span className="post-author">{post.user?.name || "Người dùng"}</span>

        {/* Nút Follow/Unfollow nếu không phải chủ bài */}
        {post.user?._id !== currentUserId && (
          <FollowButton
            userId={post.user._id}
            initialFollowing={initialIsFollowing}
            token={token}
          />
        )}
      </div>

      <p className="post-text">{post.text}</p>
      {post.image && (
  post.image.match(/\.(mp4|webm|ogg)$/i) ? (
    <video controls className="post-media">
      <source src={imageUrl} type="video/mp4" />
    </video>
  ) : (
    <img src={imageUrl} alt="post" className="post-media" />
  )
)}




      <div className="post-actions">
        <button
          className={liked ? "liked-btn pop" : "like-btn pop"}
          onClick={toggleLike}
          disabled={deleting}
          aria-label={liked ? "Unlike" : "Like"}
        >
          {liked ? "❤️" : "🤍"} {likeCount}
        </button>

        {post.user?._id === currentUserId && (
          <button
            className="delete-btn pop"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Đang xóa..." : "🗑️ Xóa"}
          </button>
        )}
      </div>

      {/* Phần comment, giữ nguyên nếu bạn có */}
      <div className="comments-section">
        <h4>Bình luận ({comments.length})</h4>
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c._id} className="comment-item fade-in-up">
              <img
                src={c.user?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="comment-avatar"
              />
              <div className="comment-content">
                <strong>{c.user?.name || "Người dùng"}</strong>
                <p>{c.text}</p>
              </div>
              {(c.user?._id === currentUserId || post.user?._id === currentUserId) && (
                <button
                  className="comment-delete-btn"
                  onClick={() => handleDeleteComment(c._id)}
                  aria-label="Xóa bình luận"
                >
                  ❌
                </button>
              )}
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            placeholder="Viết bình luận..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={commentLoading}
            required
          />
          <button type="submit" disabled={commentLoading}>
            {commentLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post
