import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Chip, Tabs, Tab, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, Stack, Avatar
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AnalyticsTab from '../components/AnalyticsTab';
import { toast } from 'react-toastify'; 

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [tabValue, setTabValue] = useState(0); 
  const [openEval, setOpenEval] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [evaluation, setEvaluation] = useState({ marks: '', remarks: '' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) { toast.error("Failed to load projects"); }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await api.put(`/projects/${projectId}/status`, { status: newStatus });
      fetchProjects(); 
      toast.success(`Project marked as ${newStatus}`);
    } catch (error) { toast.error("Failed to update status"); }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await api.get(`/files/download/${fileName}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) { toast.error("Error downloading file"); }
  };

  const handleOpenEval = (project) => {
    setSelectedProject(project);
    setOpenEval(true);
  };

  const handleSubmitEval = async () => {
    try {
      await api.post(`/evaluations/project/${selectedProject.projectId}`, evaluation);
      await api.put(`/projects/${selectedProject.projectId}/status`, { status: 'COMPLETED' });
      toast.success("Evaluation Submitted!");
      setOpenEval(false);
      setEvaluation({ marks: '', remarks: '' });
      fetchProjects();
    } catch (error) { toast.error("Failed to submit evaluation"); }
  };

  const filteredProjects = tabValue === 0 ? projects.filter(p => p.status === 'PROPOSED') : projects;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="800">Faculty Dashboard</Typography>
        <Paper sx={{ borderRadius: 50, px: 1, bgcolor: 'background.paper' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} indicatorColor="primary" textColor="inherit">
            <Tab label="Pending" />
            <Tab label="All Projects" />
            <Tab label="Analytics" />
          </Tabs>
        </Paper>
      </Box>

      {tabValue === 2 && <AnalyticsTab />}

      {tabValue < 2 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Report</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.projectId} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="600">{project.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{project.domain}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                       <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main' }}>{project.student?.name?.charAt(0)}</Avatar>
                       <Typography variant="body2">{project.student?.name}</Typography>
                       <IconButton size="small" href={`mailto:${project.student?.email}`}><MailOutlineIcon fontSize="small" /></IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={project.status} color={project.status === 'APPROVED' ? 'success' : project.status === 'COMPLETED' ? 'info' : 'default'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {project.reportFilePath ? (
                      <Button startIcon={<CloudDownloadIcon />} onClick={() => handleDownload(project.reportFilePath)} size="small">Download</Button>
                    ) : <Typography variant="caption" color="text.secondary">--</Typography>}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {project.status === 'PROPOSED' && (
                        <>
                          <Button size="small" color="success" onClick={() => handleStatusChange(project.projectId, 'APPROVED')}>Approve</Button>
                          <Button size="small" color="error" onClick={() => handleStatusChange(project.projectId, 'REJECTED')}>Reject</Button>
                        </>
                      )}
                      {project.status === 'APPROVED' && (
                        <Button size="small" variant="contained" onClick={() => handleOpenEval(project)}>Evaluate</Button>
                      )}
                      {project.status === 'COMPLETED' && <Typography variant="caption" color="success.main" fontWeight="bold">GRADED</Typography>}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProjects.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No projects found.</Typography></TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Evaluation Modal kept same as before */}
      <Dialog open={openEval} onClose={() => setOpenEval(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle>Evaluate Project</DialogTitle>
        <DialogContent>
            <TextField autoFocus margin="dense" label="Marks" type="number" fullWidth value={evaluation.marks} onChange={(e) => setEvaluation({ ...evaluation, marks: e.target.value })} />
            <TextField margin="dense" label="Remarks" multiline rows={3} fullWidth value={evaluation.remarks} onChange={(e) => setEvaluation({ ...evaluation, remarks: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEval(false)}>Cancel</Button>
          <Button onClick={handleSubmitEval} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default FacultyDashboard;