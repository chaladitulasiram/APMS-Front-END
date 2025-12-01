import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Box, Grid, Paper, Typography, CircularProgress, Card, CardContent 
} from '@mui/material';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

import { useTheme } from '@mui/material/styles'; // Import hook

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsTab = () => {
  const theme = useTheme(); // Get current theme
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/analytics/projects');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (!data) return <Typography>No analytics data available</Typography>;

  // Prepare Data for Pie Chart (Status)
  const statusLabels = Object.keys(data.projectsByStatus);
  const statusValues = Object.values(data.projectsByStatus);
  
  const pieData = {
    labels: statusLabels,
    datasets: [
      {
        label: '# of Projects',
        data: statusValues,
        backgroundColor: [
          '#FF6384', // Red (Rejected/Proposed)
          '#36A2EB', // Blue (Approved)
          '#FFCE56', // Yellow
          '#4BC0C0', // Teal (Completed)
          '#9966FF'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare Data for Bar Chart (Department)
  const deptLabels = Object.keys(data.projectsByDepartment);
  const deptValues = Object.values(data.projectsByDepartment);

  const barData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Projects per Department',
        data: deptValues,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12}>
           <Paper 
             sx={{ 
               p: 3, 
               textAlign: 'center',
               // Dynamic Background: Light Blue in Light Mode, Translucent Dark Blue in Dark Mode
               bgcolor: theme.palette.mode === 'light' 
                  ? 'rgba(227, 242, 253, 0.6)' 
                  : 'rgba(13, 71, 161, 0.3)', 
               color: theme.palette.primary.main,
               border: `1px solid ${theme.palette.primary.main}40` // Subtle blue border
             }}
           >
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{data.totalProjects}</Typography>
              <Typography variant="subtitle1" color="text.secondary">Total Projects in System</Typography>
           </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Project Status Distribution</Typography>
              <Box sx={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
                <Pie data={pieData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Department-wise Breakdown</Typography>
              <Box sx={{ maxHeight: '300px' }}>
                <Bar 
                  data={barData} 
                  options={{ responsive: true, maintainAspectRatio: false }} 
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsTab;