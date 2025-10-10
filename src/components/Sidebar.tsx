import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Manage Schools',
      href: '/schools',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Manage all schools on the platform',
      active: location.pathname === '/schools' || location.pathname.startsWith('/schools/')
    },
    {
      name: 'Admin Users',
      href: '/admin-users',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      description: 'Manage admin users for all schools',
      active: location.pathname === '/admin-users' || location.pathname.startsWith('/admin-users/')
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-80">
      {/* Logo and Brand */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <img 
          src={logo} 
          alt="iDEAL" 
          className="w-8 h-8 object-contain mr-3"
        />
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">i</span>
            <span className="text-xl font-bold text-gray-900 ml-1">DEAL</span>
          </div>
          <span className="text-sm text-gray-600 font-medium">Developer Dashboard</span>
          <span className="text-xs text-gray-500">Platform Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-start p-4 rounded-lg transition-colors duration-200 group ${
              item.active
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={`flex-shrink-0 mr-3 ${item.active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p className={`text-sm font-medium ${item.active ? 'text-purple-700' : 'text-gray-900'}`}>
                  {item.name}
                </p>
              </div>
              <p className={`text-xs mt-1 ${item.active ? 'text-purple-600' : 'text-gray-500'}`}>
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="text-center mb-4">
          <p className="text-xs text-gray-500">
            Powered by iDEAL Smart Solution Limited
          </p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
