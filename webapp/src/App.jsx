import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ExperienceLevel from './pages/ExperienceLevel';
import Skills from './pages/Skills';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding/experience" replace />} />
        <Route path="/onboarding/experience" element={<ExperienceLevel />} />
        <Route path="/onboarding/skills" element={<Skills />} />
        <Route path="/onboarding/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
