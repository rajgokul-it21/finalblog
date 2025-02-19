const express = require('express');
const { getBlogs, addBlog, getBlogById } = require('../controllers/blogController');

const router = express.Router();

router.get('/blogs', getBlogs); 
router.post('/blogs', addBlog); 
router.get('/blogs/:id', getBlogById); 

module.exports = router;
