import React from 'react';
import WelcomeGuide from './components/WelcomeGuide';
import Tooltip from './components/Tooltip';
import Header from './components/Header';
import './styles/components.css';

function App() {
  const isNewUser = !localStorage.getItem('tourComplete');
  // For demo purposes - replace this with your actual user email from authentication
  const userEmail = "user@example.com";

  return (
    <div className="app">
      <Header userEmail={userEmail} />
      
      {isNewUser && <WelcomeGuide isNewUser={isNewUser} />}
      
      <div className="main-content">
        <Tooltip text="Click here to create a new project">
          <button>New Project</button>
        </Tooltip>
      </div>
    </div>
  );
}

export default App; 