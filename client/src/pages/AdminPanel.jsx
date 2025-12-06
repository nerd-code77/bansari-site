import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  // Simple password check
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("work"); // 'hero-slider' or 'work'
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if(pass === "Bansari123") setAuth(true); // Hardcoded password for simplicity
    else alert("Wrong Password");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("category", category);

    try {
      await axios.post('https://vercel.com/dhiraj-singhs-projects-643e8126/bansari-site/3QiPPWbgSSUnzXVEq9RsLaaoJt73', formData);
      alert("Uploaded Successfully!");
      setLoading(false);
      // Reset form logic here
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

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
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded">
        <div>
            <label className="block font-bold mb-1">Select Image</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required className="border p-2 w-full"/>
        </div>
        <div>
            <label className="block font-bold mb-1">Title</label>
            <input type="text" placeholder="Meeting with Dean / Campaign Rally" value={title} onChange={(e)=>setTitle(e.target.value)} className="border p-2 w-full"/>
        </div>
        <div>
            <label className="block font-bold mb-1">Description</label>
            <textarea placeholder="Details about the event..." value={desc} onChange={(e)=>setDesc(e.target.value)} className="border p-2 w-full"/>
        </div>
        <div>
            <label className="block font-bold mb-1">Category (Where to show?)</label>
            <select value={category} onChange={(e)=>setCategory(e.target.value)} className="border p-2 w-full">
                <option value="work">Work/Activity Section</option>
                <option value="hero-slider">Main Landing Slider</option>
            </select>
        </div>
        
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded font-bold w-full">
            {loading ? "Uploading..." : "Add to Website"}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;