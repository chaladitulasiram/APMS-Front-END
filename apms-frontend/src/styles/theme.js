import { alpha } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#3B82F6', // Modern UI Blue (Cool & Professional)
    },
    secondary: {
      main: '#8B5CF6', // Modern Violet
    },
    background: {
      default: mode === 'light' ? '#F3F4F6' : '#0F172A', // Slate-900 for Dark Mode
      paper: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.7)', // Translucent Slate
    },
    text: {
      primary: mode === 'light' ? '#111827' : '#F9FAFB',
      secondary: mode === 'light' ? '#6B7280' : '#9CA3AF',
    },
    action: {
      hover: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 16, // Clean, modern curves
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minHeight: '100vh' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${mode === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: mode === 'light' 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px 16px', // COMPACT SPACING: Fixes the "too far" issue
          borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
          color: mode === 'light' ? '#4B5563' : '#94A3B8',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          backgroundColor: mode === 'light' ? 'rgba(243, 244, 246, 0.5)' : 'rgba(15, 23, 42, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly tighter buttons
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
      },
    },
  },
});