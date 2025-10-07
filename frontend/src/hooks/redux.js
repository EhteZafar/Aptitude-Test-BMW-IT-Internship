import { useDispatch, useSelector } from 'react-redux';

/**
 * Redux hooks for type-safe state management
 * These hooks provide better IntelliSense and type checking
 */

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
