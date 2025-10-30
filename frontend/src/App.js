import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import { APP_CONFIG } from './config/constants';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AttendanceDashboard />} />
          <Route path="/mark-attendance" element={<AttendanceForm />} />
        </Routes>
      </main>
      <footer className="app-footer mt-5">
        <div className="container text-center">
          <small>
            {APP_CONFIG.NAME} v{APP_CONFIG.VERSION} - {APP_CONFIG.INSTITUTION}
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;
