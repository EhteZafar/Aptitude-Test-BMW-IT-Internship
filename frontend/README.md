# Frontend - Electric Cars Data Management

React frontend application with modern UI for managing electric cars data.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will run on `http://localhost:3000`

## 🎯 Features

- 📋 **Interactive Data Grid** - View, sort, and filter electric cars data
- 🔍 **Advanced Search** - Search across all data fields
- 🎛️ **Custom Filters** - Add multiple filters with various operators
- 👁️ **Detail View** - View comprehensive car specifications
- 🗑️ **Delete Functionality** - Remove cars from the database
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Material-UI components with professional styling

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - UI component library
- **AG Grid** - Advanced data grid
- **React Router** - Navigation
- **Axios** - HTTP client
- **Emotion** - CSS-in-JS styling

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── GenericDataGrid.js   # Main data grid
│   ├── DetailView.js        # Car detail page
│   └── NotificationHandler.js # Toast notifications
├── features/            # Redux slices
│   ├── cars/               # Car-related state
│   └── ui/                 # UI state
├── hooks/               # Custom hooks
├── store/               # Redux store setup
├── App.js              # Main app component
└── index.js            # App entry point
```

## 🎨 UI Components

### Data Grid
- Sortable columns
- Pagination (20 rows per page)
- Search across all fields
- Multiple filter support
- Action buttons (View/Delete)

### Detail View
- Complete car specifications
- Metric cards with colored highlights
- Feature badges
- Navigation back to grid

### Filter Dialog
- Column selection dropdown
- Multiple filter operators
- Dynamic value input
- Filter chip display

## 📊 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm build` | Build for production |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App |

## 🔧 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@mui/material": "^7.3.4",
  "@mui/icons-material": "^7.3.4",
  "@reduxjs/toolkit": "^2.9.0",
  "react-redux": "^9.2.0",
  "react-router-dom": "^7.9.3",
  "ag-grid-react": "^34.2.0",
  "ag-grid-community": "^34.2.0",
  "axios": "^1.x.x"
}
```

## 🌐 API Integration

The frontend connects to the backend API at `http://localhost:5000/api/cars`

- Fetches car data with search and filter parameters
- Handles CRUD operations
- Error handling with user notifications
- Loading states for better UX

## 📱 Responsive Breakpoints

- **Desktop**: > 960px - Full layout
- **Tablet**: 600px - 960px - Horizontal scroll for grid
- **Mobile**: < 600px - Compact layout, stacked metrics
