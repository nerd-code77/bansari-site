require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",  
    methods: ["GET", "POST", "DELETE", "PUT"], // PUT add karna zaroori hai update ke liye
    credentials: true
}));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'bansari_election' },
});
const upload = multer({ storage: storage });

// Schema
const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  category: String,
  date: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

// --- SMART DATABASE CONNECTION (Ye Naya Hai) ---
let isConnected = false; 
const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // 5 second se zyada wait na kare
        });
        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB Connection Error:", error);
    }
};

// --- ROUTES ---

// Upload Route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  await connectDB(); // Har request se pehle connect confirm karega
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      imageUrl: req.file.path
    });
    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get Posts Route
app.get('/api/posts', async (req, res) => {
  await connectDB();
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
// --- Update Route (Edit Text) ---
app.put('/api/posts/:id', async (req, res) => {
  await connectDB();
  try {
    // Hum sirf Title, Description aur Category update kar rahe hain
    // (Agar photo badalni hai to purani delete karke nayi upload karna behtar hai)
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, 
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
      },
      { new: true } // Ye option batata hai ki update hone ke baad naya data wapis bhejo
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Route
app.delete('/api/posts/:id', async (req, res) => {
  await connectDB();
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