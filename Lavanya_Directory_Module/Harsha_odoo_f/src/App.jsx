import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import AuthPage from './pages/AuthPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDirectoryPage from './pages/EmployeeDirectoryPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import PayrollPage from './pages/PayrollPage';
import WorkdayPulsePage from './pages/WorkdayPulsePage';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const ProtectedLayout = () => {
  const { user, loading, isHR } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-app)' }}>Loading Dayflow HRMS...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0 }}>
            <Routes>
              <Route path="/dashboard" element={isHR ? <AdminDashboard /> : <EmployeeDashboard />} />
              <Route path="/directory" element={isHR ? <EmployeeDirectoryPage /> : <Navigate to="/dashboard" replace />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leaves" element={<LeavePage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/ai-pulse" element={<WorkdayPulsePage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
