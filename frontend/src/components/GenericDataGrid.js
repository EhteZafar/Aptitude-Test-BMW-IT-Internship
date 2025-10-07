import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
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
  Stack,
  CircularProgress
} from '@mui/material';
import { Visibility, Delete, FilterList, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  fetchCars,
  deleteCar,
  setSearchTerm,
  addFilter,
  removeFilter,
  clearError
} from '../features/cars/carsSlice';
import {
  openFilterDialog,
  closeFilterDialog,
  showNotification
} from '../features/ui/uiSlice';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

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
  enableActions = true
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const {
    cars: rowData,
    loading,
    searchTerm,
    filters,
    error
  } = useAppSelector((state) => state.cars);
  
  const { filterDialogOpen } = useAppSelector((state) => state.ui);
  
  // Local state for filter dialog
  const [currentFilter, setCurrentFilter] = useState({
    column: '',
    operator: 'contains',
    value: ''
  });

  // Filter operators for dropdown
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

  useEffect(() => {
    dispatch(fetchCars({ search: searchTerm, filters }));
  }, [dispatch, searchTerm, filters]);

  // Handle delete action
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await dispatch(deleteCar(id)).unwrap();
        dispatch(showNotification({
          message: 'Car deleted successfully!',
          severity: 'success'
        }));
      } catch (error) {
        dispatch(showNotification({
          message: 'Failed to delete car',
          severity: 'error'
        }));
      }
    }
  }, [dispatch]);

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
      dispatch(addFilter(currentFilter));
      setCurrentFilter({ column: '', operator: 'contains', value: '' });
      dispatch(closeFilterDialog());
    }
  };

  // Remove a filter
  const handleRemoveFilter = (index) => {
    dispatch(removeFilter(index));
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchCars({ search: searchTerm, filters }));
  };

  // Custom cell renderers for better data display
  const PriceCellRenderer = useCallback((params) => {
    if (params.value == null) return 'N/A';
    return `€${params.value.toLocaleString()}`;
  }, []);

  const BooleanCellRenderer = useCallback((params) => {
    if (params.value == null) return 'N/A';
    return params.value === 'Yes' || params.value === true ? 
      <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓ Yes</span> : 
      <span style={{ color: '#f44336', fontWeight: 'bold' }}>✗ No</span>;
  }, []);

  const PerformanceCellRenderer = useCallback((params) => {
    if (params.value == null) return 'N/A';
    const value = parseFloat(params.value);
    let color = '#666';
    if (params.colDef.field === 'accel_sec') {
      color = value <= 4 ? '#4caf50' : value <= 6 ? '#ff9800' : '#f44336';
    } else if (params.colDef.field === 'range_km') {
      color = value >= 500 ? '#4caf50' : value >= 300 ? '#ff9800' : '#f44336';
    }
    return <span style={{ color, fontWeight: 'bold' }}>{params.value}</span>;
  }, []);

  // Actions column renderer - shows View and Delete buttons
  const ActionsRenderer = useCallback((props) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleView(props.data.id)}
          title="View Details"
          sx={{ 
            '&:hover': { 
              backgroundColor: 'primary.light',
              color: 'white'
            }
          }}
        >
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(props.data.id)}
          title="Delete"
          sx={{ 
            '&:hover': { 
              backgroundColor: 'error.light',
              color: 'white'
            }
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    );
  }, [handleView, handleDelete]);

  // Automatically generate column definitions from data with enhanced formatting
  const columnDefs = useMemo(() => {
    if (rowData.length === 0) return [];

    const firstRow = rowData[0];
    const cols = Object.keys(firstRow)
      .filter(key => key !== 'created_at') // Hide created_at
      .map(key => {
        const baseConfig = {
          field: key,
          headerName: key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          sortable: true,
          filter: true,
          resizable: true,
          flex: 1,
          minWidth: 120,
        };

        // Special formatting for specific fields
        switch (key) {
          case 'price_euro':
            return {
              ...baseConfig,
              cellRenderer: PriceCellRenderer,
              type: 'numericColumn',
              width: 140,
              flex: 0,
              headerTooltip: 'Price in Euros'
            };
          case 'rapid_charge':
            return {
              ...baseConfig,
              cellRenderer: BooleanCellRenderer,
              width: 120,
              flex: 0,
              headerTooltip: 'Supports rapid charging'
            };
          case 'accel_sec':
            return {
              ...baseConfig,
              cellRenderer: PerformanceCellRenderer,
              type: 'numericColumn',
              headerName: '0-100 km/h',
              width: 120,
              flex: 0,
              headerTooltip: 'Acceleration time (seconds)'
            };
          case 'range_km':
            return {
              ...baseConfig,
              cellRenderer: PerformanceCellRenderer,
              type: 'numericColumn',
              width: 120,
              flex: 0,
              headerTooltip: 'Electric range in kilometers'
            };
          case 'brand':
            return {
              ...baseConfig,
              pinned: 'left',
              width: 100,
              flex: 0,
              cellStyle: { fontWeight: 'bold' }
            };
          case 'model':
            return {
              ...baseConfig,
              pinned: 'left',
              width: 200,
              flex: 0,
              cellStyle: { fontWeight: '500' }
            };
          case 'top_speed_kmh':
          case 'efficiency_whkm':
          case 'fast_charge_kmh':
          case 'seats':
            return {
              ...baseConfig,
              type: 'numericColumn',
              width: 130,
              flex: 0
            };
          default:
            return baseConfig;
        }
      });

    // Add Actions column if enabled
    if (enableActions) {
      cols.push({
        headerName: 'Actions',
        cellRenderer: ActionsRenderer,
        sortable: false,
        filter: false,
        width: 120,
        pinned: 'right',
        resizable: false,
        headerTooltip: 'View details or delete car'
      });
    }

    return cols;
  }, [rowData, enableActions, ActionsRenderer, PriceCellRenderer, BooleanCellRenderer, PerformanceCellRenderer]);

  // Default column properties with enhanced configuration
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true, // Enable floating filters
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    }
  }), []);

  // Grid options for enhanced UX
  const gridOptions = useMemo(() => ({
    rowSelection: 'single',
    animateRows: true,
    enableRangeSelection: true,
    suppressCellFocus: false,
    suppressRowClickSelection: false,
    enableCellTextSelection: true,
    ensureDomOrder: true,
    enableBrowserTooltips: true,
    rowHeight: 50,
    headerHeight: 56,
    suppressMenuHide: true,
    loadThemeGoogleFonts: true,
    // Row styling
    getRowStyle: (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return { backgroundColor: '#fafafa' };
      }
      return null;
    },
    // Context menu
    getContextMenuItems: (params) => [
      {
        name: 'View Details',
        action: () => handleView(params.node.data.id),
        icon: '<span>👁️</span>'
      },
      'separator',
      {
        name: 'Delete Car',
        action: () => handleDelete(params.node.data.id),
        icon: '<span>🗑️</span>'
      },
      'separator',
      'copy',
      'export'
    ]
  }), [handleView, handleDelete]);

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
    <Box sx={{ height: '100%', width: '100%', p: 3, backgroundColor: '#fafafa' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ m: 0, color: 'primary.main' }}>
            🚗 Electric Cars Data Grid
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {rowData.length} cars available
          </Typography>
        </Box>
        
        {/* Enhanced Search and Filter Controls */}
        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <TextField
            label="🔍 Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search across all columns..."
            sx={{ 
              flexGrow: 1, 
              minWidth: '300px',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<FilterList />}
            onClick={() => dispatch(openFilterDialog())}
            sx={{ 
              minWidth: '140px',
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            Add Filter
          </Button>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            disabled={loading}
            sx={{ 
              minWidth: '100px',
              borderRadius: 2
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Stack>

        {/* Enhanced Active Filters Display */}
        {filters.length > 0 && (
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
              🎯 Active Filters ({filters.length}):
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {filters.map((filter, index) => (
                <Chip
                  key={index}
                  label={`${filter.column} ${filter.operator} ${filter.value || ''}`}
                  onDelete={() => handleRemoveFilter(index)}
                  color="primary"
                  variant="filled"
                  sx={{ 
                    mb: 1, 
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: 'white'
                    }
                  }}
                />
              ))}
              <Button 
                size="small" 
                variant="text" 
                onClick={() => filters.forEach((_, index) => handleRemoveFilter(0))}
                sx={{ ml: 1, textTransform: 'none' }}
              >
                Clear All
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Enhanced Data Grid */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <div 
          className="ag-theme-quartz" 
          style={{ 
            height: 650, 
            width: '100%',
            '--ag-font-family': 'Roboto, sans-serif',
            '--ag-font-size': '14px',
            '--ag-header-background-color': '#f5f5f5',
            '--ag-header-foreground-color': '#333',
            '--ag-border-color': '#e0e0e0',
            '--ag-row-hover-color': '#f0f8ff',
            '--ag-selected-row-background-color': '#e3f2fd',
          }}
        >
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={48} />
              <Typography variant="body2" color="text.secondary">
                Loading electric cars data...
              </Typography>
            </Box>
          ) : rowData.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6" color="text.secondary">
                No cars found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          ) : (
            <AgGridReact
              theme={themeQuartz}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              gridOptions={gridOptions}
              pagination={true}
              paginationPageSize={25}
              paginationPageSizeSelector={[10, 25, 50, 100]}
              suppressPaginationPanel={false}
              statusBar={{
                statusPanels: [
                  { statusPanel: 'agTotalRowCountComponent', align: 'left' },
                  { statusPanel: 'agFilteredRowCountComponent', align: 'left' },
                  { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
                  { statusPanel: 'agAggregationComponent', align: 'right' }
                ]
              }}
              sideBar={{
                toolPanels: ['columns', 'filters'],
                defaultToolPanel: ''
              }}
              onGridReady={(params) => {
                // Auto-size columns on grid ready
                params.api.autoSizeAllColumns();
              }}
              onFirstDataRendered={(params) => {
                // Auto-size columns when data is first rendered
                params.api.autoSizeAllColumns();
              }}
            />
          )}
        </div>
      </Paper>

      {/* Enhanced Filter Dialog */}
      <Dialog 
        open={filterDialogOpen} 
        onClose={() => dispatch(closeFilterDialog())} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          position: 'relative'
        }}>
          🎛️ Add Custom Filter
          <IconButton
            onClick={() => dispatch(closeFilterDialog())}
            sx={{ 
              position: 'absolute', 
              right: 8, 
              top: 8,
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>📊 Column</InputLabel>
              <Select
                value={currentFilter.column}
                label="📊 Column"
                onChange={(e) => setCurrentFilter({ ...currentFilter, column: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                {availableColumns.map(col => (
                  <MenuItem key={col.value} value={col.value}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>⚙️ Operator</InputLabel>
              <Select
                value={currentFilter.operator}
                label="⚙️ Operator"
                onChange={(e) => setCurrentFilter({ ...currentFilter, operator: e.target.value })}
                sx={{ borderRadius: 2 }}
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
                label="📝 Filter Value"
                value={currentFilter.value}
                onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}
                placeholder="Enter filter value..."
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Button 
            onClick={() => dispatch(closeFilterDialog())}
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddFilter} 
            variant="contained"
            sx={{ borderRadius: 2, minWidth: 120, boxShadow: 2 }}
          >
            Apply Filter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenericDataGrid;

