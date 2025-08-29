import React, { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost.jsx";
import Post from "../components/Post.jsx";
import "../styles/Home.css";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
const currentUserId = user ? JSON.parse(user).id : null;


  const fetchPosts = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:3000/api/post", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setPosts(data.posts); 
    } else {
      console.error("Lấy bài viết thất bại:", data.msg || data.message || "Không xác định");
      setPosts([]);
    }
  } catch (error) {
    console.error("Lấy bài viết lỗi:", error);
    setPosts([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleDeletePost = (deletedId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== deletedId));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      {/* <Navbar/> */}

      <h2 className="home-title pop">🏡 Home</h2>

      <CreatePost onPostCreated={handleNewPost} />

      {posts.length === 0 ? (
        <p>No post 😢</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            currentUserId={currentUserId}
            token={token}
            onDelete={handleDeletePost}
          />
        ))
      )}
    </div>
  );
};

export default Home;
