import { createSlice } from '@reduxjs/toolkit';

/**
 * UI slice for managing application UI state
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Dialog states
    filterDialogOpen: false,
    deleteDialogOpen: false,
    
    // Loading states
    globalLoading: false,
    
    // Notifications
    notification: {
      open: false,
      message: '',
      severity: 'info', // 'success', 'error', 'warning', 'info'
    },
    
    // Theme
    darkMode: false,
    
    // Sidebar
    sidebarOpen: false,
  },
  reducers: {
    // Dialog actions
    openFilterDialog: (state) => {
      state.filterDialogOpen = true;
    },
    
    closeFilterDialog: (state) => {
      state.filterDialogOpen = false;
    },
    
    openDeleteDialog: (state) => {
      state.deleteDialogOpen = true;
    },
    
    closeDeleteDialog: (state) => {
      state.deleteDialogOpen = false;
    },
    
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    
    // Notification actions
    showNotification: (state, action) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    
    hideNotification: (state) => {
      state.notification.open = false;
    },
    
    // Theme actions
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  openFilterDialog,
  closeFilterDialog,
  openDeleteDialog,
  closeDeleteDialog,
  setGlobalLoading,
  showNotification,
  hideNotification,
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
