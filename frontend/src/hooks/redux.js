import { useDispatch, useSelector } from 'react-redux';

/**
 * Redux hooks for type-safe state management
 * These hooks provide better IntelliSense and type checking
 */

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
