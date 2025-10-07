const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: require('path').join(__dirname, '../../.env') });

const db = require('../config/database');

// This script creates the electric_cars table and imports data from CSV
async function initDatabase() {
  try {
    console.log('Creating electric_cars table...');
    
    // Drop table if exists and create new one
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS electric_cars (
        id INT AUTO_INCREMENT PRIMARY KEY,
        brand VARCHAR(100),
        model VARCHAR(100),
        accel_sec DECIMAL(5, 2),
        top_speed_kmh INT,
        range_km INT,
        efficiency_whkm INT,
        fast_charge_kmh INT,
        rapid_charge VARCHAR(10),
        power_train VARCHAR(50),
        plug_type VARCHAR(50),
        body_style VARCHAR(50),
        segment VARCHAR(10),
        seats INT,
        price_euro INT,
        date VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await db.query(createTableQuery);
    console.log('Table created successfully!');
    
    // Clear existing data
    await db.query('DELETE FROM electric_cars');
    console.log('Cleared existing data.');
    
    // Read and import CSV data
    const csvFilePath = require('path').join(__dirname, '../../../BMW_Aptitude_Test_Test_Data_ElectricCarData.csv');
    console.log('CSV file path:', csvFilePath);
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found at: ${csvFilePath}`);
    }
    console.log('CSV file found, starting import...');
    
    // Read file synchronously and parse manually
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    console.log(`Found ${lines.length} lines in CSV (including header)`);
    
    // Skip header line
    const dataLines = lines.slice(1);
    console.log(`Processing ${dataLines.length} data rows...`);
    
    const cars = [];
    
    dataLines.forEach((line, index) => {
      const columns = line.split(',');
      
      // Skip empty lines
      if (columns.length < 15) {
        console.log(`Skipping line ${index + 2}: insufficient columns`);
        return;
      }
      
      console.log(`Processing row ${index + 1}: ${columns[0]} ${columns[1]}`);
      
      cars.push([
        columns[0]?.trim(), // Brand
        columns[1]?.trim(), // Model
        parseFloat(columns[2]) || null, // AccelSec
        parseInt(columns[3]) || null, // TopSpeed_KmH
        parseInt(columns[4]) || null, // Range_Km
        parseInt(columns[5]) || null, // Efficiency_WhKm
        columns[6] === '-' ? null : parseInt(columns[6]), // FastCharge_KmH
        columns[7]?.trim(), // RapidCharge
        columns[8]?.trim(), // PowerTrain
        columns[9]?.trim(), // PlugType
        columns[10]?.trim(), // BodyStyle
        columns[11]?.trim(), // Segment
        parseInt(columns[12]) || null, // Seats
        parseInt(columns[13]) || null, // PriceEuro
        columns[14]?.trim() // Date
      ]);
    });
    
    console.log(`Parsed ${cars.length} cars from CSV.`);
    
    if (cars.length === 0) {
      console.log('No cars found in CSV file.');
      return;
    }
    
    // Insert all cars into database
    const insertQuery = `
      INSERT INTO electric_cars 
      (brand, model, accel_sec, top_speed_kmh, range_km, efficiency_whkm, 
       fast_charge_kmh, rapid_charge, power_train, plug_type, body_style, 
       segment, seats, price_euro, date)
      VALUES ?
    `;
    
    await db.query(insertQuery, [cars]);
    console.log(`Successfully imported ${cars.length} cars into database!`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Run the initialization
initDatabase();

