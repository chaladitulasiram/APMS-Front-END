import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from '../pages/StudentDashboard';
import FacultyDashboard from '../pages/FacultyDashboard';
import AdminDashboard from '../pages/AdminDashboard'; // Import AdminDashboard
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const DashboardRouter = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route based on Role
  if (user.role === 'ROLE_FACULTY') {
    return <FacultyDashboard />;
  } else if (user.role === 'ROLE_STUDENT') {
    return <StudentDashboard />;
  } else if (user.role === 'ROLE_ADMIN') {
    return <AdminDashboard />; // Return the new Dashboard
  } else {
    return <div>Unknown Role: {user.role}</div>;
  }
};

export default DashboardRouter;