import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import EnergyWatch from './Pages/EnergyWatch';
import ControlPanel from "./Pages/ControlPanel";
import NotFound from './Pages/NotFound';
import ProtectedRoute from "./Components/Helpers/ProtectedRoute";
import ChartPage from './Pages/ChartPage';

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
        <Route path="/controlpanel" element={
          <ProtectedRoute>
            <ControlPanel />
          </ProtectedRoute>
        } />
        <Route path="/chartex" element={<ChartPage/>} />
        <Route path="*" element={<NotFound />} /> {/* Handle 404s */}
      </Routes>
    </Router>
  );
};

export default App;
