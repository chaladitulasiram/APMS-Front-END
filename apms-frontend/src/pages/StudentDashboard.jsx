import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Container, Typography, Paper, TextField, Button, Chip, Box, Stack, 
  Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Tooltip, IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EmailIcon from '@mui/icons-material/Email';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', domain: '' });
  const [selectedFiles, setSelectedFiles] = useState({});
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({ marks: '', remarks: '' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects'); 
      const myProjects = response.data.filter(p => p.student.email === user.sub);
      setProjects(myProjects);
    } catch (error) { toast.error("Could not load projects"); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      toast.success('Project Proposed Successfully!');
      setNewProject({ title: '', description: '', domain: '' }); 
      fetchProjects(); 
    } catch (error) { toast.error('Failed to propose project'); }
  };

  const handleFileChange = (projectId, event) => {
    setSelectedFiles({ ...selectedFiles, [projectId]: event.target.files[0] });
  };

  const handleFileUpload = async (projectId) => {
    const file = selectedFiles[projectId];
    if (!file) return toast.warning("Please select a file first");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/files/upload/project/${projectId}`, formData);
      toast.success("File uploaded successfully!");
      delete selectedFiles[projectId];
      fetchProjects(); 
    } catch (error) { toast.error("File upload failed."); }
  };

  const handleViewGrade = async (projectId) => {
    try {
      const res = await api.get(`/evaluations/project/${projectId}`);
      if (res.data && res.data.length > 0) {
        setCurrentGrade(res.data[0]);
        setGradeModalOpen(true);
      } else { toast.info("Grading details not available."); }
    } catch (e) { toast.error("Could not fetch grading details."); }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PROPOSED': return 'warning';
      case 'COMPLETED': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      
      {/* --- TOP SECTION: CENTERED PROPOSAL --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: '700px', textAlign: 'center', position: 'relative', overflow:'hidden' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
          <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'primary.light', color: 'primary.main', display: 'flex' }}>
                <AddCircleOutlineIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight="700">Start a New Project</Typography>
            <Typography variant="body2" color="text.secondary">Fill in the details below to submit your idea for approval.</Typography>
          </Stack>
          
          <form onSubmit={handleCreate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField size="small" fullWidth label="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField size="small" fullWidth label="Domain" value={newProject.domain} onChange={(e) => setNewProject({...newProject, domain: e.target.value})} required />
              </Grid>
              <Grid item xs={12}>
                <TextField size="small" fullWidth multiline rows={3} label="Description" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" type="submit" size="large" fullWidth sx={{ mt: 1 }}>Submit Proposal</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      {/* --- BOTTOM SECTION: PROJECTS GRID --- */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="700">My Projects</Typography>
          <Chip label={`${projects.length} Active`} color="primary" variant="outlined" />
      </Box>

      <Grid container spacing={3}>
        {projects.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 6, textAlign: 'center', opacity: 0.6 }}>
              <Typography>No projects found. Submit your first proposal above.</Typography>
            </Paper>
          </Grid>
        ) : (
          projects.map((proj) => (
            <Grid item xs={12} sm={6} md={4} key={proj.projectId}>
              <Paper sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 2.5, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <Chip label={proj.status} color={getStatusColor(proj.status)} size="small" />
                   {proj.faculty && (
                      <Tooltip title={`Faculty: ${proj.faculty.name}`}>
                        <IconButton size="small" href={`mailto:${proj.faculty.email}`} sx={{ border: '1px solid', borderColor: 'divider' }}>
                           <EmailIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                   )}
                </Box>
                <Box sx={{ p: 2.5, flexGrow: 1 }}>
                   <Typography variant="h6" fontWeight="700" noWrap title={proj.title}>{proj.title}</Typography>
                   <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" mb={1}>{proj.domain.toUpperCase()}</Typography>
                   <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                     {proj.description || "No description."}
                   </Typography>
                </Box>
                
                {/* ACTION AREA */}
                <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.action.hover, borderTop: '1px solid', borderColor: 'divider' }}>
                   {proj.status === 'APPROVED' && (
                      proj.reportFilePath ? (
                        <Button fullWidth size="small" color="success" startIcon={<CheckCircleIcon />}>Submitted</Button>
                      ) : (
                        <Stack direction="row" spacing={1}>
                           <Button component="label" variant="outlined" size="small" fullWidth>Select<input type="file" hidden onChange={(e) => handleFileChange(proj.projectId, e)} /></Button>
                           <Button variant="contained" size="small" fullWidth onClick={() => handleFileUpload(proj.projectId)} disabled={!selectedFiles[proj.projectId]}>Upload</Button>
                        </Stack>
                      )
                   )}
                   {proj.status === 'COMPLETED' && (
                      <Button fullWidth variant="outlined" size="small" onClick={() => handleViewGrade(proj.projectId)}>View Grade</Button>
                   )}
                   {proj.status === 'PROPOSED' && <Typography variant="caption" display="block" textAlign="center" color="text.secondary">Awaiting Approval</Typography>}
                   {proj.status === 'REJECTED' && <Typography variant="caption" display="block" textAlign="center" color="error.main">Action Required</Typography>}
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={gradeModalOpen} onClose={() => setGradeModalOpen(false)} PaperProps={{ sx: { borderRadius: 4, minWidth: '350px' } }}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>Project Results</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="h2" color="primary.main" fontWeight="800">{currentGrade.marks}<span style={{fontSize:'1rem', color:'gray'}}>/100</span></Typography>
            <Divider sx={{ my: 2 }} />
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'left' }}>
               <Typography variant="body2">{currentGrade.remarks || "No remarks provided."}</Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}><Button onClick={() => setGradeModalOpen(false)}>Close</Button></DialogActions>
      </Dialog>
    </Container>
  );
};
export default StudentDashboard;