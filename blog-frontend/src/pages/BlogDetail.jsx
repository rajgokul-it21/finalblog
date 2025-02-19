import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    fetch(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || Object.keys(data).length === 0) {
          navigate("/"); 
        } else {
          setBlog(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
        navigate("/");
      });

    
    fetch(`http://localhost:5000/api/blogs/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [id, navigate]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await response.json();

      if (data.success) {
        setComments([...comments, { comment: newComment }]); 
        setNewComment(""); 
      } else {
        alert("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img src={blog.image_url} alt={blog.title} className="w-full h-80 object-cover rounded mb-4" />
      <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
      <p className="text-gray-700">{blog.content}</p>

      <h3 className="mt-4 text-lg font-semibold">Comments</h3>
      <textarea
        className="border p-2 w-full mt-2"
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button
        onClick={handleAddComment}
        className="block mt-2 px-4 py-2 border"
      >
        Add Comment
      </button>

      <ul className="mt-2">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <li key={index} className="border-b p-2">{comment.comment}</li>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </ul>
    </div>
  );
};

export default BlogDetail;
