import React, { useState } from 'react';
import { 
  BellIcon, 
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Tooltip from '../Tooltip';

const Header = ({ userEmail, onSignOut }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';
  
  // Get first name from email
  const firstName = userEmail ? userEmail.split('@')[0].split('.')[0] : '';
  const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <header className="bg-gradient-to-r from-primary-900/90 via-primary-800/90 to-primary-900/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Welcome Message and Stats */}
          <div className="flex items-center space-x-6">
            <div className="welcome-container">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-5 w-5 text-yellow-400 animate-pulse" />
                <h1 className="text-base sm:text-lg font-semibold text-white">
                  Good {timeOfDay}, {capitalizedName}!
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-primary-100 mt-1">
                {userEmail}
              </p>
            </div>

            {/* Quick Stats - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="stat-pill">
                <ChartBarIcon className="h-4 w-4" />
                <span>Portfolio: +2.4%</span>
              </div>
              <div className="stat-pill">
                <SparklesIcon className="h-4 w-4" />
                <span>Goals: 3/5</span>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Tooltip text="AI Insights Available">
              <button className="header-action-button">
                <div className="notification-dot"></div>
                <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </Tooltip>

            <Tooltip text="Notifications">
              <button className="header-action-button">
                <div className="notification-dot"></div>
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </Tooltip>

            <div className="h-8 w-px bg-primary-700 mx-1 hidden sm:block" />

            <Tooltip text="Profile Settings">
              <button className="header-action-button">
                <UserCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </Tooltip>

            <Tooltip text="Sign Out">
              <button 
                onClick={onSignOut}
                className="header-action-button"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 