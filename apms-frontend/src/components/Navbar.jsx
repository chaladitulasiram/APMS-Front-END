import React, { useContext, useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, IconButton, 
  Menu, MenuItem, Avatar, Tooltip, Divider, ListItemIcon 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useColorMode } from '../context/ColorModeContext';
import { useTheme } from '@mui/material/styles';

// Icons
import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 
import Logout from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        // FIX: Stronger Glass Effect to prevent "Color Mixing"
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.85)' // Higher opacity white
          : 'rgba(15, 23, 42, 0.85)',   // Higher opacity dark slate
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`,
        color: 'text.primary',
        transition: 'all 0.3s ease',
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensures it stays on top of everything
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
          
          {/* LOGO SECTION */}
          <Box 
            component={Link} 
            to="/dashboard" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <Box 
              sx={{ 
                p: 0.8, 
                borderRadius: '10px', 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, 
                color: 'white', 
                display: 'flex',
                boxShadow: `0 4px 10px ${theme.palette.primary.main}40`
              }}
            >
              <SchoolIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              APMS
            </Typography>
          </Box>

          {/* ACTIONS SECTION */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            
            {/* Theme Toggle */}
            <Tooltip title="Switch Theme">
              <IconButton 
                onClick={toggleColorMode} 
                size="small" 
                sx={{ 
                  color: 'text.secondary', 
                  bgcolor: theme.palette.action.hover,
                  '&:hover': { bgcolor: theme.palette.action.selected }
                }}
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                {/* User Profile Chip */}
                <Box 
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    cursor: 'pointer',
                    pl: 0.5, pr: 1.5, py: 0.5,
                    borderRadius: 50,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                    transition: 'all 0.2s',
                    '&:hover': { 
                      bgcolor: theme.palette.action.hover,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'primary.main', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                      {user.role.replace('ROLE_', '')}
                    </Typography>
                  </Box>
                  
                  <KeyboardArrowDownIcon fontSize="small" color="action" />
                </Box>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      mt: 1.5,
                      borderRadius: 4,
                      minWidth: 200,
                      overflow: 'visible',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">Signed in as</Typography>
                    <Typography variant="subtitle2" fontWeight="700" noWrap>{user.sub}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => navigate('/dashboard')} sx={{ py: 1.5 }}>
                    <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
                    <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                sx={{ borderRadius: 50, px: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;