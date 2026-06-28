import React from 'react';
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
} from '@mui/material';

const positionLabel = (pos) => {
  if (pos === 1) return '🥇 1st';
  if (pos === 2) return '🥈 2nd';
  if (pos === 3) return '🥉 3rd';
  return pos;
};

export default function ResultsTable({ results, eventName }) {
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
          Results — {eventName}
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(15, 23, 42, 0.04)' }}>
                <TableCell><strong>Position</strong></TableCell>
                <TableCell><strong>Participants</strong></TableCell>
                <TableCell><strong>School</strong></TableCell>
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
                    <Typography variant="body2" fontWeight={600}>
                      {positionLabel(r.position)}
                    </Typography>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}