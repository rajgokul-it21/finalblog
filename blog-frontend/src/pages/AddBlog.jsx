import React, { useState } from 'react';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image_url, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBlog = async () => {
    if (!title || !content || !image_url) {
      alert('Please fill in all required fields!');
      return;
    }

    setLoading(true);

    const newBlog = { title, content, image_url };

    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      });

      if (response.ok) {
        alert('Blog added successfully!');
        setTitle('');
        setContent('');
        setImage('');
      } else {
        const errorData = await response.json();
        alert(`Failed to add blog: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add a New Blog</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full p-2 mb-2 border"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="block w-full p-2 mb-2 border"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full p-2 mb-2 border"
      />
      <button
        onClick={handleAddBlog}
        className="block px-4 py-2 border hover:bg-gray-100"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Blog'}
      </button>
    </div>
  );
};

export default AddBlog;
