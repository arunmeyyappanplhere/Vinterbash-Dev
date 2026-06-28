import React, { useState, useMemo } from 'react';
import axios from '../axios';
import { useStateValue } from '../StateProvider';
import {
  Box, Button, Divider, Grid, IconButton,
  InputLabel, MenuItem, Paper, Select, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './EnterResults.css';

const POSITION_POINTS = { 1: 10, 2: 7, 3: 5 };

export default function EnterResults() {
  const [{ assignedEvent }] = useStateValue();

  const eventId   = assignedEvent?.eventId   || '';
  const eventName = assignedEvent?.eventName || '';
  const allTeams  = assignedEvent?.particpants || [];

  const schoolOptions = [...new Map(allTeams.map((t) => [t.schoolName, t.schoolName])).keys()];

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [position, setPosition]             = useState(1);
  const [rows, setRows]                     = useState([]);
  const [message, setMessage]               = useState('');
  const [loading, setLoading]               = useState(false);

  const teamOptions = useMemo(() => {
    if (!selectedSchool) return [];
    return allTeams.filter((t) => t.schoolName?.trim() === selectedSchool?.trim());
  }, [selectedSchool, allTeams]);

  const selectedTeam = useMemo(() => {
    return teamOptions.find((t) => t.teamId === selectedTeamId) || null;
  }, [teamOptions, selectedTeamId]);

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
    setSelectedTeamId('');
  };

  const addRow = () => {
    if (!selectedSchool || !selectedTeamId) {
      setMessage('Select a school and team first');
      return;
    }
    if (rows.find((r) => r.teamId === selectedTeamId)) {
      setMessage('This team is already in the list');
      return;
    }
    setRows((prev) => [
      ...prev,
      {
        eventId,
        eventName,
        schoolName: selectedSchool,
        teamId:     selectedTeam.teamId,
        teamName:   selectedTeam.teamName,
        members:    selectedTeam.members,
        position,
        points:     POSITION_POINTS[position],
      },
    ]);
    setMessage('');
  };

  const removeRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!rows.length) {
      setMessage('Add at least one result before saving');
      return;
    }
    try {
      setLoading(true);
      await Promise.all(
        rows.map((r) =>
          axios.post('/vinterbash/enterResults', {
            event_id: r.eventId,
            team_id:  r.teamId,
            position: r.position,
            points:   r.points,
          })
        )
      );
      setMessage('Results saved successfully');
      setRows([]);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (!assignedEvent) {
    return (
      <Box className="enter-results-page">
        <Typography>No event assigned. Please sign in as an organiser.</Typography>
      </Box>
    );
  }

  return (
    <Box className="enter-results-page">
      <Typography variant="h4" gutterBottom className="enter-results-title">
        Enter Results
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} className="enter-results-card" sx={{ overflow: 'visible' }}>

            <Box className="event-banner">
              <Typography variant="subtitle2" className="event-banner-label">Your event</Typography>
              <Typography variant="h6" className="event-banner-name">{eventName}</Typography>
            </Box>

            <Divider className="section-divider" />

            <Typography variant="h6" gutterBottom className="section-title">
              Result entry
            </Typography>

            <Box component="form" onSubmit={handleSubmit} className="enter-results-form">
              <Grid container spacing={2}>

                {/* School dropdown */}
                <Grid item xs={12} sm={6}>
                  <InputLabel className="input-label">School</InputLabel>
                  <Select
                    fullWidth
                    value={selectedSchool}
                    onChange={handleSchoolChange}
                    displayEmpty
                    size="small"
                    className="input-select"
                    MenuProps={{
                      disablePortal: false,
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          overflowY: 'auto',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Select school</MenuItem>
                    {schoolOptions.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                {/* Team dropdown */}
                <Grid item xs={12} sm={6}>
                  <InputLabel className="input-label">Team / Participant</InputLabel>
                  <Select
                    fullWidth
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    displayEmpty
                    size="small"
                    className="input-select"
                    disabled={!selectedSchool}
                    MenuProps={{
                      disablePortal: false,
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          overflowY: 'auto',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      {selectedSchool ? 'Select team' : 'Select a school first'}
                    </MenuItem>
                    {teamOptions.map((t) => {
                      const memberList = t.members || [];
                      return (
                        <MenuItem key={t.teamId} value={t.teamId}>
                          {memberList.length === 1
                            ? memberList[0]
                            : `${t.teamName} (${memberList.length} members)`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
              </Grid>

              {/* Members preview — rendered outside the Grid to avoid clipping */}
              {selectedTeam && selectedTeam.members?.length > 1 && (
                <Box className="members-preview" style={{ marginTop: '16px' }}>
                  <Typography variant="caption" className="members-label">Members:</Typography>
                  <Typography variant="body2">
                    {selectedTeam.members.join(', ')}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2} alignItems="center" style={{ marginTop: '8px' }}>
                <Grid item xs={6} sm={3}>
                  <InputLabel className="input-label">Position</InputLabel>
                  <Select
                    fullWidth
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    size="small"
                    className="input-select"
                  >
                    <MenuItem value={1}>🥇 1st — 10 pts</MenuItem>
                    <MenuItem value={2}>🥈 2nd — 7 pts</MenuItem>
                    <MenuItem value={3}>🥉 3rd — 5 pts</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    onClick={addRow}
                    size="small"
                    className="primary-button"
                    disabled={!selectedTeamId}
                    sx={{ mt: 3.5 }}
                  >
                    Add to list
                  </Button>
                </Grid>
              </Grid>

              <Divider className="section-divider" />

              <Box className="section-header">
                <Typography variant="subtitle1" className="section-label">
                  Pending results ({rows.length})
                </Typography>
                <Typography variant="subtitle2">
                  {rows.reduce((s, r) => s + r.points, 0)} total pts
                </Typography>
              </Box>

              {rows.length === 0 ? (
                <Typography className="empty-state">
                  Use the dropdowns above to add results to the list.
                </Typography>
              ) : (
                rows.map((r, i) => (
                  <Paper key={`${r.teamId}-${i}`} variant="outlined" className="participant-card">
                    <Grid container spacing={2} alignItems="center" className="participant-grid">
                      <Grid item xs={12} sm={5}>
                        <Typography variant="body2" fontWeight={600}>
                          {r.members.length === 1 ? r.members[0] : r.teamName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.schoolName}
                        </Typography>
                        {r.members.length > 1 && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {r.members.join(', ')}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2">
                          {r.position === 1 ? '🥇 1st' : r.position === 2 ? '🥈 2nd' : '🥉 3rd'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <Typography variant="body2" className="points-label">
                          {r.points} pts
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={2} className="delete-cell">
                        <IconButton color="error" onClick={() => removeRow(i)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}

              <Box className="form-actions">
                <Button
                  variant="outlined"
                  onClick={() => setRows([])}
                  size="small"
                  className="secondary-button"
                >
                  Clear all
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !rows.length}
                  className="primary-button"
                >
                  {loading ? 'Saving...' : 'Save results'}
                </Button>
              </Box>

              {message && (
                <Typography
                  className={
                    message.toLowerCase().includes('fail') || message.toLowerCase().includes('error')
                      ? 'message-error'
                      : 'message-success'
                  }
                >
                  {message}
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}