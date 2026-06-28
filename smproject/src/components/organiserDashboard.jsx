import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useStateValue } from '../StateProvider';
import AnimatedPage from '../templates/AnimatedPage';

function OrganiserDashboard() {
  const [{ organiserName, organiserId, role }] = useStateValue();

  const displayName = organiserName || 'Organiser';
  const displayId = organiserId || 'Pending';
  const displayRole = role || 'Event Staff';

  return (
    <AnimatedPage>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: { xs: '16px', sm: '24px', md: '32px' },
          boxSizing: 'border-box',
        }}
      >
        <Box>
          <Typography variant="h4" fontFamily="'nevis', sans-serif" color="#F68F04" gutterBottom>
            Organiser Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is a dummy page for testing organiser-specific features and workflows.
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {displayName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Organiser ID: {displayId}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={`Role: ${displayRole}`} color="warning" />
              <Chip label="Dummy Page" variant="outlined" />
            </Stack>
          </Stack>
        </Paper>

        <Box display="flex" flexWrap="wrap" gap={2}>
          <Paper elevation={2} sx={{ flex: '1 1 220px', p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Events Assigned</Typography>
            <Typography variant="h4" mt={1} fontWeight={700}>12</Typography>
          </Paper>

          <Paper elevation={2} sx={{ flex: '1 1 220px', p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Pending Checks</Typography>
            <Typography variant="h4" mt={1} fontWeight={700}>4</Typography>
          </Paper>

          <Paper elevation={2} sx={{ flex: '1 1 220px', p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Live Status</Typography>
            <Typography variant="h4" mt={1} fontWeight={700}>Ready</Typography>
          </Paper>
        </Box>
      </Box>
    </AnimatedPage>
  );
}

export default OrganiserDashboard;

