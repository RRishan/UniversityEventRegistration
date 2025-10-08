// tests/event/delete_event.test.js
const request = require('supertest');
const app = require('../../app.js');

// Modules
const { Event } = require('../utils/modules.js');

// Mock authentication middleware
jest.mock('../../middleware/userAuth', () => (req, res, next) => next());

// Base endpoint
const endpoint = '/api/event/delete';

const {
  testSuccessfulDeletion,
  testDeleteError,
  testDeleteNotFound,
  testDeleteMissingId,
} = require('../utils/requestHelpers.js');

describe('Delete Event - Basic Tests', () => {
    // For Successful Deletion: 200 status code
    it('should delete the event successfully', async () => {
        await testSuccessfulDeletion({
          app,
          endpoint,
          Model: Event,
          eventId: '68e6668c09cac9795a9184eb',
          successMessage: 'Succsfully deleted the event !!'
        });
    });

    // For Server/DB Errors: 500 status code
    it('should return 500 with error message if DB fails', async () => {
        await testDeleteError({
          app,
          endpoint,
          Model: Event,
          eventId: '123abc',
          errorMessage: 'Database failure'
        });
    });

    // Test for non-existent event
    it('should return 400 if event does not exist', async () => {
      await testDeleteNotFound({
        app,
        endpoint,
        Model: Event,
        eventId: 'nonexistentId',
        expectedMessage: 'Invalid event Id'
      });
    });

    // Test for missing eventId
    it('should return 400 if eventId is missing', async () => {
        await testDeleteMissingId({ app, endpoint });
    });
});