import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  
  // Data States
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null); // Agar ye null nahi hai, matlab hum edit kar rahe hain
  
  // Form States
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("work");
  const [loading, setLoading] = useState(false);

  // --- 1. Login Logic ---
  const handleLogin = () => {
    if(pass === "Bansari123") setAuth(true);
    else alert("Wrong Password");
  }

  // --- 2. Fetch All Posts (Load data) ---
  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://bansari-site.vercel.app/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Login hone ke baad data lao
  useEffect(() => {
    if(auth) fetchPosts();
  }, [auth]);


  // --- 3. Handle Submit (Create or Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // CASE A: UPDATE (Agar Edit Mode mein hain)
      if (editId) {
        await axios.put(`https://bansari-site.vercel.app/api/posts/${editId}`, {
          title,
          description: desc,
          category
        });
        alert("✅ Updated Successfully!");
        setEditId(null); // Edit mode band karo
      } 
      // CASE B: CREATE NEW (Agar Naya Upload kar rahe hain)
      else {
        if (!file) { alert("Please select an image!"); setLoading(false); return; }
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("description", desc);
        formData.append("category", category);

        await axios.post('https://bansari-site.vercel.app/api/upload', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Uploaded Successfully!");
      }

      // Cleanup
      setTitle(""); setDesc(""); setFile(null); setCategory("work");
      fetchPosts(); // List refresh karo
      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("❌ Error aa gaya bhai!");
      setLoading(false);
    }
  };

  // --- 4. Delete Function ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this?")) return;
    
    try {
        await axios.delete(`https://bansari-site.vercel.app/api/posts/${id}`);
        alert("🗑️ Deleted!");
        fetchPosts(); // Refresh list
    } catch (err) {
        alert("Error deleting");
    }
  }

  // --- 5. Edit Button Logic ---
  const handleEdit = (post) => {
    setEditId(post._id); // Batao ki hum is ID ko edit kar rahe hain
    setTitle(post.title);
    setDesc(post.description);
    setCategory(post.category);
    // Note: Image edit nahi kar rahe simplify rakhne ke liye
    window.scrollTo(0,0); // Upar scroll karo form ki taraf
  }

  // --- RENDER ---
  if(!auth) return (
    <div className="flex h-screen justify-center items-center bg-gray-200">
        <div className="bg-white p-10 rounded shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Admin Login</h2>
            <input type="password" placeholder="Enter PIN" className="border p-2 w-full mb-4" onChange={(e)=>setPass(e.target.value)}/>
            <button onClick={handleLogin} className="bg-blue-900 text-white w-full py-2">Login</button>
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      
      {/* FORM SECTION */}
      <div className="bg-white p-6 shadow-md rounded mb-10 border-t-4 border-orange-500">
        <h2 className="text-xl font-bold mb-4">{editId ? "✏️ Edit Post" : "➕ Add New Post"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            {!editId && (
                <div>
                    <label className="block font-bold mb-1">Select Image</label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 w-full"/>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-bold mb-1">Title</label>
                    <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className="border p-2 w-full" required/>
                </div>
                <div>
                    <label className="block font-bold mb-1">Category</label>
                    <select value={category} onChange={(e)=>setCategory(e.target.value)} className="border p-2 w-full">
                        <option value="work">Work/Activity Section</option>
                        <option value="hero-slider">Main Landing Slider</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea rows="3" value={desc} onChange={(e)=>setDesc(e.target.value)} className="border p-2 w-full" required/>
            </div>
            
            <div className="flex gap-2">
                <button type="submit" disabled={loading} className={`text-white px-6 py-2 rounded font-bold w-full ${editId ? 'bg-blue-600' : 'bg-green-600'}`}>
                    {loading ? "Processing..." : (editId ? "Update Changes" : "Add to Website")}
                </button>
                {editId && (
                    <button type="button" onClick={() => {setEditId(null); setTitle(""); setDesc("");}} className="bg-gray-500 text-white px-4 rounded">
                        Cancel
                    </button>
                )}
            </div>
        </form>
      </div>

      {/* LIST SECTION (Manage Posts) */}
      <h2 className="text-2xl font-bold mb-4">Manage Existing Posts ({posts.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
              <div key={post._id} className="bg-white p-4 rounded shadow flex gap-4 items-center border">
                  <img src={post.imageUrl} alt="th" className="w-20 h-20 object-cover rounded bg-gray-200" />
                  <div className="flex-1">
                      <h3 className="font-bold text-lg">{post.title}</h3>
                      <p className="text-xs text-gray-500 mb-2 truncate">{post.description}</p>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded uppercase font-bold text-gray-600">{post.category}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                      <button onClick={() => handleEdit(post)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                      <button onClick={() => handleDelete(post._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                  </div>
              </div>
          ))}
      </div>

    </div>
  );
};

export default AdminPanel;