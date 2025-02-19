const db = require("./db");
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT ;


app.use(cors());
app.use(bodyParser.json());


const pool = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();


app.get('/api/blogs', async (req, res) => {
    try {
        const [blogs] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        res.json(blogs);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});


app.post('/api/blogs', async (req, res) => {
    try {
        const { title, content, image } = req.body;

        if (!title || !content || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await pool.query(
            'INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)',
            [title, content, image]
        );

        res.status(201).json({ message: "Blog added successfully", blogId: result[0].insertId });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});


app.get('/api/blogs/:id', async (req, res) => {
    try {
        const [blog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

        if (blog.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json(blog[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});


app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});


app.post("/api/blogs/:id/like", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE blogs SET likes = likes + 1 WHERE id = ?", [id]);
        const [updatedBlog] = await pool.query("SELECT likes FROM blogs WHERE id = ?", [id]);
        res.json({ success: true, likes: updatedBlog[0].likes });
    } catch (error) {
        console.error("Error liking blog:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});


app.post("/api/blogs/:id/view", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE blogs SET views = views + 1 WHERE id = ?", [id]);
        const [updatedBlog] = await pool.query("SELECT views FROM blogs WHERE id = ?", [id]);
        res.json({ success: true, views: updatedBlog[0].views });
    } catch (error) {
        console.error("Error updating view count:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});


app.post("/api/blogs/:id/comment", async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        await pool.query("INSERT INTO comments (blog_id, comment) VALUES (?, ?)", [id, comment]);
        res.json({ success: true, message: "Comment added!" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});


app.get("/api/blogs/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;
        const [comments] = await pool.query("SELECT * FROM comments WHERE blog_id = ?", [id]);
        res.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.post('/api/blogs/:id/comment', async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    try {
        const [result] = await db.query("INSERT INTO comments (blog_id, comment) VALUES (?, ?)", [id, comment]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: "Comment added successfully" });
        } else {
            res.status(500).json({ success: false, message: "Failed to add comment" });
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.put("/api/blogs/:id/edit", async (req, res) => {
    const { id } = req.params;
    const { title, image, content } = req.body;
  
    try {
      await db.query(
        "UPDATE blogs SET title = ?, image = ?, content = ? WHERE id = ?",
        [title, image, content, id]
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });
  
  


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
