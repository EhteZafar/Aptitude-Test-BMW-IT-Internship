import { configureStore } from '@reduxjs/toolkit';
import carsReducer from '../features/cars/carsSlice';
import uiReducer from '../features/ui/uiSlice';

/**
 * Redux Store Configuration
 * 
 * This store manages the application state using Redux Toolkit.
 * It includes:
 * - carsSlice: Manages electric cars data, search, and filters
 * - uiSlice: Manages UI state like loading, errors, and dialogs
 */
export const store = configureStore({
  reducer: {
    cars: carsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
