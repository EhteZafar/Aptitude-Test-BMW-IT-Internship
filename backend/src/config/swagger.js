const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BMW Aptitude Test - Electric Cars API',
    version: '1.0.0',
  },
  components: {
    schemas: {
      ElectricCar: {
        type: 'object',
        required: ['brand', 'model'],
        properties: {
          id: {
            type: 'integer',
            description: 'Unique identifier for the car',
            example: 1
          },
          brand: {
            type: 'string',
            description: 'Car manufacturer brand',
            example: 'Tesla'
          },
          model: {
            type: 'string',
            description: 'Car model name',
            example: 'Model 3 Long Range'
          },
          accel_sec: {
            type: 'number',
            format: 'float',
            description: 'Acceleration time from 0-100 km/h in seconds',
            example: 4.6
          },
          top_speed_kmh: {
            type: 'integer',
            description: 'Maximum speed in km/h',
            example: 233
          },
          range_km: {
            type: 'integer',
            description: 'Driving range in kilometers',
            example: 450
          },
          efficiency_whkm: {
            type: 'integer',
            description: 'Energy efficiency in Wh/km',
            example: 161
          },
          fast_charge_kmh: {
            type: 'integer',
            nullable: true,
            description: 'Fast charging speed in km/h of range',
            example: 940
          },
          rapid_charge: {
            type: 'string',
            enum: ['Yes', 'No'],
            description: 'Whether rapid charging is supported',
            example: 'Yes'
          },
          power_train: {
            type: 'string',
            description: 'Type of power train (AWD, RWD, FWD)',
            example: 'AWD'
          },
          plug_type: {
            type: 'string',
            description: 'Charging plug type',
            example: 'Type 2 CCS'
          },
          body_style: {
            type: 'string',
            description: 'Vehicle body style',
            example: 'Sedan'
          },
          segment: {
            type: 'string',
            description: 'Market segment classification',
            example: 'D'
          },
          seats: {
            type: 'integer',
            description: 'Number of seats',
            example: 5
          },
          price_euro: {
            type: 'integer',
            description: 'Price in Euros',
            example: 55480
          },
          date: {
            type: 'string',
            description: 'Date information',
            example: '8/24/16'
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Record creation timestamp',
            example: '2024-01-01T12:00:00Z'
          }
        }
      },
      Filter: {
        type: 'object',
        required: ['column', 'operator'],
        properties: {
          column: {
            type: 'string',
            description: 'Column name to filter on',
            example: 'price_euro'
          },
          operator: {
            type: 'string',
            enum: [
              'contains', 'equals', 'startsWith', 'endsWith',
              'isEmpty', 'isNotEmpty', 'greaterThan', 'lessThan',
              'greaterThanOrEqual', 'lessThanOrEqual'
            ],
            description: 'Filter operator',
            example: 'lessThan'
          },
          value: {
            type: 'string',
            description: 'Filter value (not required for isEmpty/isNotEmpty)',
            example: '50000'
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the request was successful'
          },
          message: {
            type: 'string',
            description: 'Response message'
          },
          count: {
            type: 'integer',
            description: 'Number of items returned (for list endpoints)'
          },
          data: {
            description: 'Response data'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            description: 'Error message',
            example: 'Resource not found'
          },
          error: {
            type: 'string',
            description: 'Detailed error information'
          }
        }
      }
    },
    parameters: {
      CarId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Unique identifier of the car',
        schema: {
          type: 'integer',
          example: 1
        }
      },
      SearchQuery: {
        name: 'search',
        in: 'query',
        required: false,
        description: 'Search term to filter cars across multiple columns',
        schema: {
          type: 'string',
          example: 'Tesla'
        }
      },
      FiltersQuery: {
        name: 'filters',
        in: 'query',
        required: false,
        description: 'JSON array of filter objects',
        schema: {
          type: 'string',
          example: '[{"column":"price_euro","operator":"lessThan","value":"50000"}]'
        }
      }
    }
  },
  tags: [
    {
      name: 'Cars',
      description: 'Electric cars management operations'
    },
    {
      name: 'Metadata',
      description: 'Database and schema information'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/server.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi
};
