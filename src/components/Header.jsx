import React from 'react';
import Tooltip from './Tooltip';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ userEmail }) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back!
          </h1>
          <p className="text-sm text-gray-600">{userEmail}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Tooltip text="View your profile settings">
            <button className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition duration-200 blur" />
              <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-200 group-hover:border-transparent transition duration-200">
                {userEmail ? (
                  <span className="text-sm font-medium text-gray-900">
                    {userEmail.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserCircleIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Header; 