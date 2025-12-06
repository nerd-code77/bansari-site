import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Name */}
        <Link to="/" className="text-2xl font-bold text-orange-500 tracking-wider">
          BANSARI DATT
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-orange-400 transition font-medium">Home</Link>
          <Link to="/admin-bansari-secure" className="bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 transition text-sm font-bold shadow-lg">
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;