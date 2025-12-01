import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider } from './context/ColorModeContext'; // Import the new provider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRouter from './components/DashboardRouter';

// Wrapper component to access theme for ToastContainer
const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ColorModeProvider>
      <CssBaseline />
      {/* ToastContainer placed here to be global */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme="colored" // Allows it to adapt to success/error colors better
      />
      
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ColorModeProvider>
  );
}

export default App;