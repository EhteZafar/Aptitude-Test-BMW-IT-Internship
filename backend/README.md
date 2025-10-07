# Backend API Server

Node.js/Express API server for the Electric Cars Data Management application.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize database with CSV data (first time only)
npm run init-db

# Start the server
npm start
```

The server will run on `http://localhost:5000`

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | Get all cars with optional search & filters |
| GET | `/api/cars/:id` | Get a specific car by ID |
| DELETE | `/api/cars/:id` | Delete a car by ID |
| GET | `/api/cars/columns` | Get column information |

## 📖 API Documentation

Visit `http://localhost:5000/api-docs` for interactive Swagger documentation.

## 🗄️ Database

- Uses SQLite database
- Data is automatically initialized from CSV file on first run
- Database file: `cars.db`
- **Important**: Run `npm run init-db` before first use to import CSV data

### Database Initialization

The `npm run init-db` command will:
1. Create the `electric_cars` table
2. Import data from `BMW_Aptitude_Test_Test_Data_ElectricCarData.csv`
3. Insert ~103 electric car records into the database

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite** - Database
- **Swagger** - API documentation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
src/
├── server.js           # Main server file
├── config/
│   ├── database.js     # Database configuration
│   └── swagger.js      # Swagger setup
├── controllers/
│   └── carsController.js  # API logic
├── routes/
│   └── carsRoutes.js   # Route definitions
└── scripts/
    └── initDatabase.js # Database initialization
```

## 🔧 Environment Variables

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
```

## 📊 Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run init-db` | Initialize database with CSV data |
| `npm start` | Start the API server |

## 📊 Sample Response

```json
{
  "success": true,
  "count": 103,
  "data": [
    {
      "id": 1,
      "brand": "Tesla",
      "model": "Model 3 Long Range Dual Motor",
      "accel_sec": 4.6,
      "top_speed_kmh": 233,
      "range_km": 450,
      "efficiency_whkm": 161,
      "fast_charge_kmh": 940,
      "rapid_charge": "Yes",
      "power_train": "AWD",
      "plug_type": "Type 2 CCS",
      "body_style": "Sedan",
      "segment": "D",
      "seats": 5,
      "price_euro": 55480
    }
  ]
}
```