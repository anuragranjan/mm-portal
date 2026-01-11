import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/Dashboard/DashboardHome';
import MembersList from './pages/Dashboard/MembersList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="members" element={<MembersList />} />
          {/* Add more routes here */}
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
