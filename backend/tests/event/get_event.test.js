const request = require('supertest');
const app = require('../../app.js');

// Modules
const { Event } = require('../utils/modules.js');

// Mock authentication middleware
jest.mock('../../middleware/userAuth', () => (req, res, next) => next());

// Base endpoint
const endpoint = '/api/event/event';

const {
    testApiError,
    testMissingId,
} = require('../utils/requestHelpers.js');

describe('Get Event - Basic Tests', () => {
    // For Server/DB Errors: 500 status code
    it('should return 500 with error message if DB fails', async() => {
        await testApiError({
            app,
            method: 'get',
            endpoint,
            Model: Event,
            methodToMock: 'findById',
            errorMessage: 'Database failure',
            query: { eventId: '68e6668c09cac9795a9184eb' },
            body: {},
            status: 400
        });
    });

    // Test for missing eventId
    it('should return 400 if eventId is missing', async () => {
        await testMissingId({
          app,
          method: 'get',
          endpoint,
          idField: 'eventId',   // optional, defaults to 'eventId'
          sendInBody: false      // GET expects ID in query
        });
    });
});