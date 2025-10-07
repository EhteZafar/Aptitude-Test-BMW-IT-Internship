import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack
} from '@mui/material';
import { Visibility, Delete, FilterList, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * GenericDataGrid Component
 * 
 * This is a reusable data grid that can display ANY data structure.
 * It automatically creates columns based on the data you provide.
 * 
 * Features:
 * - Automatic column generation
 * - Search functionality
 * - Advanced filtering
 * - View and Delete actions
 * - Sorting and pagination
 */
const GenericDataGrid = ({
  apiEndpoint = 'http://localhost:5000/api/cars',
  onRowClick,
  enableActions = true
}) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    column: '',
    operator: 'contains',
    value: ''
  });
  
  const navigate = useNavigate();

  // Filter operators with user-friendly labels
  const filterOperators = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
    { value: 'lessThanOrEqual', label: 'Less Than or Equal' }
  ];

  // Fetch data from API with search and filters
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (filters.length > 0) {
        params.filters = JSON.stringify(filters);
      }
      
      const response = await axios.get(apiEndpoint, { params });
      setRowData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, searchTerm, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle delete action
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${apiEndpoint}/${id}`);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  }, [apiEndpoint, fetchData]);

  // Handle view action - navigate to detail page
  const handleView = useCallback((id) => {
    navigate(`/details/${id}`);
  }, [navigate]);

  // Add a new filter
  const handleAddFilter = () => {
    if (currentFilter.column && 
        (currentFilter.value || 
         currentFilter.operator === 'isEmpty' || 
         currentFilter.operator === 'isNotEmpty')) {
      setFilters([...filters, currentFilter]);
      setCurrentFilter({ column: '', operator: 'contains', value: '' });
      setFilterDialogOpen(false);
    }
  };

  // Remove a filter
  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Actions column renderer - shows View and Delete buttons
  const ActionsRenderer = useCallback((props) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleView(props.data.id)}
          title="View Details"
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(props.data.id)}
          title="Delete"
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    );
  }, [handleView, handleDelete]);

  // Automatically generate column definitions from data
  const columnDefs = useMemo(() => {
    if (rowData.length === 0) return [];

    const firstRow = rowData[0];
    const cols = Object.keys(firstRow)
      .filter(key => key !== 'created_at') // Hide created_at
      .map(key => ({
        field: key,
        headerName: key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        minWidth: 120
      }));

    // Add Actions column if enabled
    if (enableActions) {
      cols.push({
        headerName: 'Actions',
        cellRenderer: ActionsRenderer,
        sortable: false,
        filter: false,
        width: 120,
        pinned: 'right'
      });
    }

    return cols;
  }, [rowData, enableActions, ActionsRenderer]);

  // Default column properties
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  // Get available columns for filtering
  const availableColumns = useMemo(() => {
    if (rowData.length === 0) return [];
    return Object.keys(rowData[0])
      .filter(key => key !== 'created_at')
      .map(key => ({
        value: key,
        label: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }));
  }, [rowData]);

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Electric Cars Data Grid
        </Typography>
        
        {/* Search and Filter Controls */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across all columns..."
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<FilterList />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Add Filter
          </Button>
          <Button
            variant="outlined"
            onClick={fetchData}
          >
            Refresh
          </Button>
        </Stack>

        {/* Active Filters Display */}
        {filters.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {filters.map((filter, index) => (
                <Chip
                  key={index}
                  label={`${filter.column} ${filter.operator} ${filter.value || ''}`}
                  onDelete={() => handleRemoveFilter(index)}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* AG Grid */}
      <Paper elevation={3}>
        <div className="ag-theme-material" style={{ height: 600, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            loading={loading}
            animateRows={true}
            rowSelection="single"
          />
        </div>
      </Paper>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Filter
          <IconButton
            onClick={() => setFilterDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Column</InputLabel>
              <Select
                value={currentFilter.column}
                label="Column"
                onChange={(e) => setCurrentFilter({ ...currentFilter, column: e.target.value })}
              >
                {availableColumns.map(col => (
                  <MenuItem key={col.value} value={col.value}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                value={currentFilter.operator}
                label="Operator"
                onChange={(e) => setCurrentFilter({ ...currentFilter, operator: e.target.value })}
              >
                {filterOperators.map(op => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {currentFilter.operator !== 'isEmpty' && currentFilter.operator !== 'isNotEmpty' && (
              <TextField
                fullWidth
                label="Value"
                value={currentFilter.value}
                onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}
                placeholder="Enter filter value..."
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddFilter} variant="contained">
            Add Filter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenericDataGrid;

