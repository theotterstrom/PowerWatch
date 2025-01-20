import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import EnergyWatch from './Pages/EnergyWatch';
import NotFound from './Pages/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from "./Components/Helpers/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/energywatch" element={
          <ProtectedRoute>
            <EnergyWatch />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} /> {/* Handle 404s */}
      </Routes>
    </Router>
  );
};

export default App;
