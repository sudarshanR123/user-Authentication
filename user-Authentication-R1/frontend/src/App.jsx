import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSelection from './pages/ProfileSelection';
import JobSeekerProfile from './pages/JobSeekerProfile';
import EmployerProfile from './pages/EmployerProfile';
import { motion, AnimatePresence } from 'framer-motion';

import ProtectedRoute from './components/ProtectedRoute';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import ViewApplicants from './pages/ViewApplicants';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile/select" element={<ProfileSelection />} />
            <Route path="/profile/seeker" element={<JobSeekerProfile />} />
            <Route path="/profile/employer" element={<EmployerProfile />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard/seeker" element={
              <ProtectedRoute requiredRole="seeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/employer" element={
              <ProtectedRoute requiredRole="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/jobs/post" element={
              <ProtectedRoute requiredRole="employer">
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/jobs/applicants/:jobId" element={
              <ProtectedRoute requiredRole="employer">
                <ViewApplicants />
              </ProtectedRoute>
            } />
          </Routes>

        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
