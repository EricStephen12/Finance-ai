import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div 
        className={`
          absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5
          text-xs font-medium text-white
          bg-gray-900/95 backdrop-blur-sm
          rounded-lg shadow-lg
          whitespace-nowrap
          transition-all duration-200 ease-out
          ${isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-1 pointer-events-none'
          }
        `}
      >
        {text}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900/95" />
      </div>
    </div>
  );
};

export default Tooltip; 