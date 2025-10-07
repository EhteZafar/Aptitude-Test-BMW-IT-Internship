const db = require('../config/database');

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all electric cars
 *     description: |
 *       Retrieve all electric cars with optional search and filtering capabilities.
 *       
 *       **Search**: Searches across brand, model, body_style, segment, and power_train columns.
 *       
 *       **Filters**: Supports complex filtering with multiple operators:
 *       - `contains`: Field contains the value
 *       - `equals`: Field exactly matches the value  
 *       - `startsWith`: Field begins with the value
 *       - `endsWith`: Field ends with the value
 *       - `isEmpty`: Field is null or empty
 *       - `isNotEmpty`: Field has a value
 *       - `greaterThan`: Numeric comparison (>)
 *       - `lessThan`: Numeric comparison (<)
 *       - `greaterThanOrEqual`: Numeric comparison (>=)
 *       - `lessThanOrEqual`: Numeric comparison (<=)
 *       
 *       Multiple filters can be applied simultaneously (AND logic).
 *     tags: [Cars]
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/FiltersQuery'
 *     responses:
 *       200:
 *         description: Successfully retrieved cars
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Number of cars returned
 *                       example: 25
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ElectricCar'
 *             examples:
 *               all_cars:
 *                 summary: All cars
 *                 value:
 *                   success: true
 *                   count: 103
 *                   data: []
 *               search_tesla:
 *                 summary: Search for Tesla cars
 *                 value:
 *                   success: true
 *                   count: 7
 *                   data: []
 *               filtered_affordable:
 *                 summary: Cars under €40,000
 *                 value:
 *                   success: true
 *                   count: 15
 *                   data: []
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Error fetching data"
 *               error: "Database connection failed"
 */
exports.getAllCars = async (req, res) => {
  try {
    const { search, filters } = req.query;
    
    let query = 'SELECT * FROM electric_cars WHERE 1=1';
    const params = [];
    
    // Handle search - searches across brand, model, body_style, and segment
    if (search && search.trim() !== '') {
      query += ` AND (
        brand LIKE ? OR 
        model LIKE ? OR 
        body_style LIKE ? OR 
        segment LIKE ? OR
        power_train LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    // Handle filters - supports multiple filter conditions
    if (filters) {
      const filterArray = typeof filters === 'string' ? JSON.parse(filters) : filters;
      
      if (Array.isArray(filterArray) && filterArray.length > 0) {
        filterArray.forEach(filter => {
          const { column, operator, value } = filter;
          
          switch (operator) {
            case 'contains':
              query += ` AND ${column} LIKE ?`;
              params.push(`%${value}%`);
              break;
            case 'equals':
              query += ` AND ${column} = ?`;
              params.push(value);
              break;
            case 'startsWith':
              query += ` AND ${column} LIKE ?`;
              params.push(`${value}%`);
              break;
            case 'endsWith':
              query += ` AND ${column} LIKE ?`;
              params.push(`%${value}`);
              break;
            case 'isEmpty':
              query += ` AND (${column} IS NULL OR ${column} = '')`;
              break;
            case 'isNotEmpty':
              query += ` AND ${column} IS NOT NULL AND ${column} != ''`;
              break;
            case 'greaterThan':
              query += ` AND ${column} > ?`;
              params.push(parseFloat(value));
              break;
            case 'lessThan':
              query += ` AND ${column} < ?`;
              params.push(parseFloat(value));
              break;
            case 'greaterThanOrEqual':
              query += ` AND ${column} >= ?`;
              params.push(parseFloat(value));
              break;
            case 'lessThanOrEqual':
              query += ` AND ${column} <= ?`;
              params.push(parseFloat(value));
              break;
            default:
              break;
          }
        });
      }
    }
    
    query += ' ORDER BY id';
    
    const [rows] = await db.query(query, params);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
    
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a single car by ID
 *     description: Retrieve detailed information about a specific electric car by its unique identifier.
 *     tags: [Cars]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Car found successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ElectricCar'
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 brand: "Tesla"
 *                 model: "Model 3 Long Range"
 *                 accel_sec: 4.6
 *                 top_speed_kmh: 233
 *                 range_km: 450
 *                 efficiency_whkm: 161
 *                 fast_charge_kmh: 940
 *                 rapid_charge: "Yes"
 *                 power_train: "AWD"
 *                 plug_type: "Type 2 CCS"
 *                 body_style: "Sedan"
 *                 segment: "D"
 *                 seats: 5
 *                 price_euro: 55480
 *                 date: "8/24/16"
 *                 created_at: "2024-01-01T12:00:00Z"
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Car not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.query(
      'SELECT * FROM electric_cars WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching car details',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     description: |
 *       Permanently delete an electric car from the database by its unique identifier.
 *       
 *       **Warning**: This action cannot be undone.
 *     tags: [Cars]
 *     parameters:
 *       - $ref: '#/components/parameters/CarId'
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Car deleted successfully"
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Car not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.query(
      'DELETE FROM electric_cars WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting car',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/cars/columns:
 *   get:
 *     summary: Get database column information
 *     description: |
 *       Retrieve metadata about the electric_cars table columns.
 *       This endpoint is useful for dynamically building user interfaces
 *       that need to know the database schema.
 *       
 *       **Use case**: The Generic DataGrid component uses this to automatically
 *       generate column definitions and filter options.
 *     tags: [Metadata]
 *     responses:
 *       200:
 *         description: Column information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           Field:
 *                             type: string
 *                             description: Column name
 *                             example: "brand"
 *                           Type:
 *                             type: string
 *                             description: MySQL column type
 *                             example: "varchar(100)"
 *                           Null:
 *                             type: string
 *                             description: Whether column allows NULL
 *                             example: "YES"
 *                           Key:
 *                             type: string
 *                             description: Key type (PRI, UNI, etc.)
 *                             example: "PRI"
 *                           Default:
 *                             type: string
 *                             nullable: true
 *                             description: Default value
 *                           Extra:
 *                             type: string
 *                             description: Extra information
 *                             example: "auto_increment"
 *             example:
 *               success: true
 *               data:
 *                 - Field: "id"
 *                   Type: "int"
 *                   Null: "NO"
 *                   Key: "PRI"
 *                   Default: null
 *                   Extra: "auto_increment"
 *                 - Field: "brand"
 *                   Type: "varchar(100)"
 *                   Null: "YES"
 *                   Key: ""
 *                   Default: null
 *                   Extra: ""
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getColumns = async (req, res) => {
  try {
    const [columns] = await db.query(
      'DESCRIBE electric_cars'
    );
    
    res.json({
      success: true,
      data: columns
    });
    
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching column information',
      error: error.message
    });
  }
};

