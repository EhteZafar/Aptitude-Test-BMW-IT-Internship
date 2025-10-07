import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import GenericDataGrid from './components/GenericDataGrid';
import DetailView from './components/DetailView';

/**
 * Main App Component
 * 
 * This sets up:
 * - Material-UI theme for consistent styling
 * - React Router for navigation between pages
 * - Routes for the DataGrid and Detail views
 */

// Create a custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // BMW blue-ish color
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
          <Routes>
            {/* Main page - shows the data grid */}
            <Route path="/" element={<GenericDataGrid />} />
            
            {/* Detail page - shows details of a single item */}
            <Route path="/details/:id" element={<DetailView />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
