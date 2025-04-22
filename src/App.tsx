import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientsList from './pages/ClientsList';
import ClientDetails from './pages/ClientDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientsList />} />
        <Route path="/cliente/:id" element={<ClientDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
