const db = require('../db');


exports.getBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addBlog = async (req, res) => {
  const { title, content, image } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    await db.query('INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)', [title, content, image]);
    res.status(201).json({ message: 'Blog added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const [blog] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (blog.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
