import { useState } from 'react';
import { SearchIcon } from 'lucide-react';

const Header = () => {
  return (
    <header className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">RSBlog</h1>
        <div className="flex items-center border border-gray-300">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-white"
          />
            <SearchIcon className="mr-2" />
        </div>
      </div>
      <div className="mt-4 flex  justify-end space-x-4 text-lg">
        <a href="/" className="hover:text-gray-400">Home</a>
        <a href="/add-blog" className="hover:text-gray-400">Add Blog</a>
      </div>
      <hr className="mt-4 border-gray-600" />
    </header>
  );
};

export default Header;
