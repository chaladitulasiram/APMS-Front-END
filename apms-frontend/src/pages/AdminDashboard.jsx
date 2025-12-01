import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Paper, Tabs, Tab, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Tooltip, Avatar, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AnalyticsTab from '../components/AnalyticsTab';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [studentRes, facultyRes] = await Promise.all([api.get('/students'), api.get('/faculty')]);
      setStudents(studentRes.data);
      setFaculty(facultyRes.data);
    } catch (error) { toast.error("Failed to load user data"); }
  };

  const initiateDelete = (type, id) => {
    setUserToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const endpoint = userToDelete.type === 'student' ? `/students/${userToDelete.id}` : `/faculty/${userToDelete.id}`;
      await api.delete(endpoint);
      toast.success("User deleted successfully");
      fetchData(); 
    } catch (error) { toast.error("Failed to delete user"); } 
    finally { setDeleteDialogOpen(false); setUserToDelete(null); }
  };

  const UserTable = ({ data, type }) => (
    <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Details</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={type === 'student' ? row.studentId : row.facultyId} hover>
              <TableCell><Typography color="text.secondary" variant="body2">#{type === 'student' ? row.studentId : row.facultyId}</Typography></TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: type === 'student' ? 'primary.main' : 'secondary.main' }}>
                    {row.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography fontWeight="500" variant="body2">{row.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                {type === 'student' 
                  ? <Chip label={`${row.course} • Year ${row.year}`} size="small" variant="outlined" />
                  : <Chip label={`${row.designation}`} size="small" variant="outlined" />
                }
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => initiateDelete(type, type === 'student' ? row.studentId : row.facultyId)} size="small" color="error">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No users found.</Typography></TableCell></TableRow>}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="800">Admin Portal</Typography>
        <Paper sx={{ borderRadius: 50, px: 1, bgcolor: 'background.paper' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} indicatorColor="primary" textColor="inherit">
            <Tab label="Students" />
            <Tab label="Faculty" />
            <Tab label="Analytics" />
          </Tabs>
        </Paper>
      </Box>
      {tabValue === 0 && <UserTable data={students} type="student" />}
      {tabValue === 1 && <UserTable data={faculty} type="faculty" />}
      {tabValue === 2 && <AnalyticsTab />}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to delete this user? This cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default AdminDashboard;