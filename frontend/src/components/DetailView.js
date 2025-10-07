import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import { ArrowBack, DirectionsCar } from '@mui/icons-material';
import axios from 'axios';

/**
 * DetailView Component
 * 
 * This component displays detailed information about a single item.
 * It automatically formats and displays all fields in a nice card layout.
 * 
 * Features:
 * - Automatic field rendering
 * - Back button to return to grid
 * - Loading state
 * - Error handling
 */
const DetailView = ({ apiEndpoint = 'http://localhost:5000/api/cars' }) => {
  const { id } = useParams(); // Get the ID from URL
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the detailed data when component loads
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiEndpoint}/${id}`);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to load details. The item may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, apiEndpoint]);

  // Format field names to look nice (snake_case to Title Case)
  const formatFieldName = (field) => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format field values based on type
  const formatFieldValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value.toString();
  };

  // Determine if field should be highlighted (important fields)
  const isHighlightField = (field) => {
    const highlightFields = ['brand', 'model', 'price_euro', 'range_km', 'top_speed_kmh'];
    return highlightFields.includes(field.toLowerCase());
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'No data found'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Grid
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Back Button */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DirectionsCar fontSize="large" color="primary" />
            <div>
              <Typography variant="h4">
                {data.brand} {data.model}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Detailed Information
              </Typography>
            </div>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
          >
            Back to Grid
          </Button>
        </Box>
      </Paper>

      {/* Highlighted Information Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {data.price_euro && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Price</Typography>
                <Typography variant="h4">€{data.price_euro.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {data.range_km && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Range</Typography>
                <Typography variant="h4">{data.range_km} km</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {data.top_speed_kmh && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Top Speed</Typography>
                <Typography variant="h4">{data.top_speed_kmh} km/h</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {data.accel_sec && (
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">0-100 km/h</Typography>
                <Typography variant="h4">{data.accel_sec}s</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* All Details */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Complete Specifications
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {Object.entries(data)
            .filter(([key]) => !['id', 'created_at'].includes(key))
            .map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {formatFieldName(key)}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: isHighlightField(key) ? 600 : 400 }}>
                    {formatFieldValue(value)}
                  </Typography>
                </Box>
              </Grid>
            ))}
        </Grid>

        {/* Special badges for certain features */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" gutterBottom>
            Features:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {data.rapid_charge === 'Yes' && (
              <Chip label="Rapid Charging" color="success" />
            )}
            {data.power_train && (
              <Chip label={data.power_train} color="primary" variant="outlined" />
            )}
            {data.body_style && (
              <Chip label={data.body_style} color="secondary" variant="outlined" />
            )}
            {data.plug_type && (
              <Chip label={data.plug_type} variant="outlined" />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DetailView;

