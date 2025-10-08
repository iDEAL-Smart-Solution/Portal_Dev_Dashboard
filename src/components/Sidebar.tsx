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
