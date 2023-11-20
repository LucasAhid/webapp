import React, { useState } from 'react';
import './App.css';

import HomePage from './home';


function App() {
  const [page, setPage] = useState('home');

  const handleRedirect = (targetPage) => {
    setPage(targetPage);
  };

  return (
    <div>
      {page === 'home' && <HomePage onRedirect={handleRedirect} />}
    </div>
  );
}

export default App;
