import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientsList from './pages/ClientsList';
import ClientDetails from './pages/ClientDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientsList />} />
        <Route path="/client/:id" element={<ClientDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
