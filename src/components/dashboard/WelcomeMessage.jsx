import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

const WelcomeMessage = ({ userEmail }) => {
  const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';
  
  // Get first name from email
  const firstName = userEmail ? userEmail.split('@')[0].split('.')[0] : '';
  const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="relative overflow-hidden">
      {/* Background with modern gradient and subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/90 to-purple-900/90 backdrop-blur-sm" />
      
      {/* Animated sparkles in background */}
      <div className="absolute inset-0">
        <div className="absolute h-6 w-6 bg-primary-300/20 rounded-full blur-sm animate-pulse" style={{ top: '20%', left: '10%' }} />
        <div className="absolute h-4 w-4 bg-purple-300/20 rounded-full blur-sm animate-pulse delay-300" style={{ top: '60%', left: '80%' }} />
        <div className="absolute h-5 w-5 bg-blue-300/20 rounded-full blur-sm animate-pulse delay-700" style={{ top: '30%', left: '60%' }} />
      </div>

      {/* Content */}
      <div className="relative px-3 py-2 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        {/* Welcome Text */}
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary-200 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-white text-sm font-light">
              Good {timeOfDay}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 font-semibold text-lg sm:text-xl tracking-tight">
              {capitalizedName}
            </span>
          </div>
        </div>

        {/* Email Display */}
        <div className="flex items-center">
          <div className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="text-primary-100 text-sm font-light">
              {userEmail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage; 