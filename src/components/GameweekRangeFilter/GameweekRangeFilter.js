import React, { useState } from 'react';
import {
  Box,
  Slider,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { FilterList as FilterIcon, Refresh as RefreshIcon } from '@mui/icons-material';

/**
 * GameweekRangeFilter Component
 *
 * Provides a slider interface for filtering player stats by gameweek range
 *
 * Props:
 *   - maxGameweek: The maximum gameweek available (usually current GW)
 *   - onFilterApply: Callback when filter is applied, receives [startGW, endGW]
 *   - disabled: Whether the filter is disabled
 *   - defaultRange: Optional default range [start, end]
 */
export default function GameweekRangeFilter({
  maxGameweek = 38,
  onFilterApply,
  disabled = false,
  defaultRange = null
}) {
  const initialRange = defaultRange || [1, maxGameweek];
  const [gwRange, setGwRange] = useState(initialRange);
  const [loading, setLoading] = useState(false);

  const handleSliderChange = (event, newValue) => {
    setGwRange(newValue);
  };

  const applyFilter = async () => {
    setLoading(true);
    try {
      await onFilterApply(gwRange);
    } catch (error) {
      console.error('Error applying filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = async () => {
    const fullRange = [1, maxGameweek];
    setGwRange(fullRange);
    setLoading(true);
    try {
      await onFilterApply(fullRange);
    } catch (error) {
      console.error('Error resetting filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFiltered = gwRange[0] !== 1 || gwRange[1] !== maxGameweek;

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        marginY: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        border: isFiltered ? '2px solid #1976d2' : '1px solid #e0e0e0'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <FilterIcon sx={{ marginRight: 1, color: '#1976d2' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filter by Gameweek Range
        </Typography>
      </Box>

      <Box sx={{ paddingX: 2, marginBottom: 2 }}>
        <Slider
          value={gwRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={1}
          max={maxGameweek}
          marks={[
            { value: 1, label: 'GW1' },
            { value: Math.floor(maxGameweek / 2), label: `GW${Math.floor(maxGameweek / 2)}` },
            { value: maxGameweek, label: `GW${maxGameweek}` }
          ]}
          disabled={disabled || loading}
          sx={{
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
            },
            '& .MuiSlider-track': {
              height: 6,
            },
            '& .MuiSlider-rail': {
              height: 6,
            }
          }}
        />
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body2" color="textSecondary" align="center">
          {gwRange[0] === gwRange[1] ? (
            <>Showing stats from <strong>Gameweek {gwRange[0]}</strong> only</>
          ) : (
            <>
              Showing stats from <strong>Gameweek {gwRange[0]}</strong> to{' '}
              <strong>Gameweek {gwRange[1]}</strong>
              {' '}({gwRange[1] - gwRange[0] + 1} gameweeks)
            </>
          )}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Tooltip title="Apply the selected gameweek range filter">
          <span>
            <Button
              variant="contained"
              onClick={applyFilter}
              disabled={disabled || loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <FilterIcon />}
              sx={{ minWidth: 140 }}
            >
              {loading ? 'Loading...' : 'Apply Filter'}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Reset to full season (GW1 to current GW)">
          <span>
            <Button
              variant="outlined"
              onClick={resetFilter}
              disabled={disabled || loading || !isFiltered}
              startIcon={<RefreshIcon />}
              sx={{ minWidth: 140 }}
            >
              Reset Filter
            </Button>
          </span>
        </Tooltip>
      </Box>

      {isFiltered && (
        <Typography
          variant="caption"
          color="primary"
          align="center"
          display="block"
          sx={{ marginTop: 1, fontWeight: 600 }}
        >
          ✓ Filter active
        </Typography>
      )}
    </Paper>
  );
}
