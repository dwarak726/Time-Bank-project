// src/components/Topbar.jsx
import React from 'react';
import { SearchIcon } from '@heroicons/react/outline';

export default function Topbar() {
  return (
    <header className="flex-1 flex items-center justify-between bg-white border-b px-8 py-4 ml-64">
      <div className="relative w-96">
        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search services, tasks, profiles…"
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900 transition">Help</button>
        <button className="text-gray-600 hover:text-gray-900 transition">Logout</button>
      </div>
    </header>
  );
}
