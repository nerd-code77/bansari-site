require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// 2. Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bansari_election',
  },
});
const upload = multer({ storage: storage });

// 3. Schema (Data Structure)
const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String, // Cloudinary URL yaha aayega
  category: String, // 'hero-slider' ya 'work-gallery'
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

// 4. API Routes

// Post Upload (Admin Only)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      imageUrl: req.file.path // Cloudinary se mila hua path
    });
    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Posts (Public)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Post (Admin Only)
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;