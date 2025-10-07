const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController');

// GET all cars with optional search and filters
router.get('/', carsController.getAllCars);

// GET column information
router.get('/columns', carsController.getColumns);

// GET a single car by ID
router.get('/:id', carsController.getCarById);

// DELETE a car by ID
router.delete('/:id', carsController.deleteCar);

module.exports = router;

