import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { hideNotification } from '../features/ui/uiSlice';

/**
 * NotificationHandler Component
 * 
 * Global notification system that displays success, error, warning, and info messages
 * Uses Redux to manage notification state across the application
 */
const NotificationHandler = () => {
  const dispatch = useAppDispatch();
  const { notification } = useAppSelector((state) => state.ui);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationHandler;
