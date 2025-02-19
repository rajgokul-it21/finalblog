import React from 'react';
import { Home, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-48 bg-gray-100 p-4 border-r border-gray-300 h-full">
      <Link to="/" className="flex items-center mb-4 p-2 hover:bg-gray-200 rounded">
        <Home className="mr-2" /> Home
      </Link>
      <Link to="/add-blog" className="flex items-center p-2 hover:bg-gray-200 rounded">
        <Plus className="mr-2" /> Add Blog
      </Link>
    </aside>
  );
};

export default Sidebar;