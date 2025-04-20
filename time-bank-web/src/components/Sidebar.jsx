// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  ClipboardListIcon,
  PlusCircleIcon,
  CogIcon,
} from '@heroicons/react/outline';

const links = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/dashboard', label: 'Dashboard', Icon: ClipboardListIcon },
  { to: '/tasks', label: 'All Tasks', Icon: ClipboardListIcon },
  { to: '/tasks/new', label: 'New Task', Icon: PlusCircleIcon },
  { to: '/profile', label: 'Profile', Icon: UserIcon },
  { to: '/settings', label: 'Settings', Icon: CogIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-lg fixed inset-y-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">TimeBank</h1>
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 mb-4 p-2 rounded hover:bg-gray-100 transition ${
                isActive ? 'bg-gray-200 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
