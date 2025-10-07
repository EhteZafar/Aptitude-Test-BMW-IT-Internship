const db = require('../config/database');

/**
 * GET all cars with optional search and filtering
 * This endpoint supports:
 * - search: searches across multiple columns
 * - filters: array of filter objects with column, operator, and value
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
 * GET a single car by ID
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
 * DELETE a car by ID
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
 * GET column information for dynamic grid setup
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

