import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pages/Home';
import Demo from './Pages/Demo';
import PowerWatch from './Pages/PowerWatch';
import ControlPanel from "./Pages/ControlPanel";
import NotFound from './Pages/NotFound';
import ProtectedRoute from "./Components/Helpers/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
         <Route path="/dashboards" element={
          <ProtectedRoute>
            <PowerWatch />
          </ProtectedRoute>
        } /> 

        <Route path="/controlpanel" element={
          <ProtectedRoute>
            <ControlPanel />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} /> {/* Handle 404s */}
      </Routes>
    </Router>
  );
};

export default App;
