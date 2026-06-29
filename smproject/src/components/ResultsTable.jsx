import React, { useState } from 'react';
import axios from '../axios';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const POSITION_POINTS = { 1: 10, 2: 7, 3: 5 };

const positionLabel = (pos) => {
  if (pos === 1) return '🥇 1st';
  if (pos === 2) return '🥈 2nd';
  if (pos === 3) return '🥉 3rd';
  return pos;
};

export default function ResultsTable({ results, setResults, eventId }) {
  // const [editingResultId, setEditingResultId] = useState(null);
  // const [editPosition, setEditPosition]       = useState(1);

  const [editingResultId, setEditingResultId] = useState(null);
const [editPosition, setEditPosition] = useState(1);
const [message, setMessage] = useState('');

  const handleEdit = (r) => {
    setEditingResultId(r.resultId);
    setEditPosition(r.position);
  };

  const handleCancel = () => {
    setEditingResultId(null);
  };

  // const handleSave = async (r) => {
  //   const teamId = r.resultId.replace(eventId, '');
  //   try {
  //     await axios.post('/vinterbash/enterResults', {
  //       event_id: eventId,
  //       team_id:  teamId,
  //       position: editPosition,
  //       points:   POSITION_POINTS[editPosition],
  //     });

  //     setResults((prev) =>
  //       prev.map((result) =>
  //         result.resultId === r.resultId
  //           ? { ...result, position: editPosition, points: POSITION_POINTS[editPosition] }
  //           : result
  //       )
  //     );
  //     setEditingResultId(null);
  //   } catch (err) {
  //     console.error('Failed to update result:', err);
  //   }
  // };

  const handleSave = async (r) => {
  // Check if another team already has the selected position
  const positionTaken = results.some(
    (result) =>
      result.resultId !== r.resultId &&
      result.position === editPosition
  );

  if (positionTaken) {
    alert(
      `${editPosition === 1 ? '1st' : editPosition === 2 ? '2nd' : '3rd'} position is already assigned to another team.`
    );
    return;
  }

  const teamId = r.resultId.replace(eventId, '');

  try {
    await axios.post('/vinterbash/enterResults', {
      event_id: eventId,
      team_id: teamId,
      position: editPosition,
      points: POSITION_POINTS[editPosition],
    });

    setResults((prev) =>
      prev.map((result) =>
        result.resultId === r.resultId
          ? {
              ...result,
              position: editPosition,
              points: POSITION_POINTS[editPosition],
            }
          : result
      )
    );

    setEditingResultId(null);
  } catch (err) {
    console.error('Failed to update result:', err);
    alert('Failed to update result');
  }
};

  if (!results || results.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{
        padding: '32px',
        borderRadius: '28px',
        background: 'rgba(255, 255, 255, 0.96)',
        boxShadow: '0 28px 60px rgba(15, 23, 42, 0.12)',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, marginBottom: '20px' }}>
          Results — {results[0]?.eventName}
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(15, 23, 42, 0.04)' }}>
                <TableCell><strong>Position</strong></TableCell>
                <TableCell><strong>Participants</strong></TableCell>
                <TableCell><strong>School</strong></TableCell>
                <TableCell align="right"><strong>Edit</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r) => (
                <TableRow
                  key={r.resultId}
                  sx={{
                    '&:last-child td': { border: 0 },
                    '&:hover': { backgroundColor: 'rgba(15, 23, 42, 0.02)' },
                  }}
                >
                  <TableCell>
                    {editingResultId === r.resultId ? (
                      <Select
                        value={editPosition}
                        onChange={(e) => setEditPosition(Number(e.target.value))}
                        size="small"
                      >
                        <MenuItem value={1}>🥇 1st</MenuItem>
                        <MenuItem value={2}>🥈 2nd</MenuItem>
                        <MenuItem value={3}>🥉 3rd</MenuItem>
                      </Select>
                    ) : (
                      <Typography variant="body2" fontWeight={600}>
                        {positionLabel(r.position)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {r.members.join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {r.schoolName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {editingResultId === r.resultId ? (
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <IconButton color="success" size="small" onClick={() => handleSave(r)}>
                          <CheckIcon />
                        </IconButton>
                        <IconButton color="default" size="small" onClick={handleCancel}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton color="primary" size="small" onClick={() => handleEdit(r)}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {message && (
  <Typography
    sx={{
      mt: 2,
      fontWeight: 600,
      color:
        message.toLowerCase().includes('taken') ||
        message.toLowerCase().includes('failed')
          ? 'error.main'
          : 'success.main',
    }}
  >
    {message}
  </Typography>
)}
      </Paper>
    </Box>
  );
}