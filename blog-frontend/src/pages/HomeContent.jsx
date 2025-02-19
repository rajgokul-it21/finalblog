import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Eye, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const HomeContent = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const handleLike = async (id) => {
    const response = await fetch(`http://localhost:5000/api/blogs/${id}/like`, { method: "POST" });
    const data = await response.json();
    if (data.success) {
      setBlogs(blogs.map(blog => blog.id === id ? { ...blog, likes: data.likes } : blog));
    }
  };

  const handleView = async (id) => {
    await fetch(`http://localhost:5000/api/blogs/${id}/view`, { method: "POST" });
    navigate(`/blog/${id}`); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await fetch(`http://localhost:5000/api/blogs/${id}`, { method: "DELETE" });
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {blogs.map((blog) => (
        <div key={blog.id} className="border p-4">
          <button onClick={() => handleView(blog.id)} className="block w-full text-left">
            <img src={blog.image_url} alt={blog.title} className="w-full h-40 object-cover mb-2" />
            <h3 className="text-lg font-bold">{blog.title}</h3>
            <p className="text-sm">{blog.content.substring(0, 100)}...</p>
          </button>

          <div className="flex justify-between mt-2">
            <button onClick={() => handleLike(blog.id)} className="flex items-center text-red-500">
              <Heart size={18} className="mr-1" /> Like ({blog.likes})
            </button>
            <div className="flex items-center text-green-500">
              <Eye size={18} className="mr-1" /> Views ({blog.views})
            </div>
            <button onClick={() => handleDelete(blog.id)} className="flex items-center text-gray-500">
              <Trash2 size={18} className="mr-1" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeContent;
