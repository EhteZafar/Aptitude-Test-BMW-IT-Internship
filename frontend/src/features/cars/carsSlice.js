import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Async thunk to fetch all cars with optional search and filters
 */
export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async ({ search = '', filters = [] } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      
      if (search) {
        params.search = search;
      }
      
      if (filters.length > 0) {
        params.filters = JSON.stringify(filters);
      }
      
      const response = await axios.get(`${API_BASE_URL}/cars`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Async thunk to fetch a single car by ID
 */
export const fetchCarById = createAsyncThunk(
  'cars/fetchCarById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cars/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Async thunk to delete a car by ID
 */
export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/cars/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Async thunk to fetch column information
 */
export const fetchColumns = createAsyncThunk(
  'cars/fetchColumns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cars/columns`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Cars slice for managing electric cars state
 */
const carsSlice = createSlice({
  name: 'cars',
  initialState: {
    // Data
    cars: [],
    selectedCar: null,
    columns: [],
    
    // Search and filters
    searchTerm: '',
    filters: [],
    
    // UI state
    loading: false,
    error: null,
    
    // Pagination
    currentPage: 1,
    totalCount: 0,
    pageSize: 20,
  },
  reducers: {
    // Search actions
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    // Filter actions
    addFilter: (state, action) => {
      state.filters.push(action.payload);
    },
    
    removeFilter: (state, action) => {
      state.filters.splice(action.payload, 1);
    },
    
    clearFilters: (state) => {
      state.filters = [];
    },
    
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear selected car
    clearSelectedCar: (state) => {
      state.selectedCar = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cars
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.data || [];
        state.totalCount = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch car by ID
      .addCase(fetchCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCar = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete car
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        // Remove deleted car from the list
        state.cars = state.cars.filter(car => car.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        state.error = null;
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch columns
      .addCase(fetchColumns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.loading = false;
        state.columns = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  addFilter,
  removeFilter,
  clearFilters,
  setCurrentPage,
  setPageSize,
  clearError,
  clearSelectedCar,
} = carsSlice.actions;

export default carsSlice.reducer;
