const request = require('supertest');
const app = require('../../app.js');
const { testMissingOrInvalidField } = require('../utils/validationHelpers.js');

// Import data for testing
const {
  eventData
} = require('../data/testEvents.js');

// Import reusable request helpers
const { 
  testSuccessfulRegistration,
  testDuplicateErrorResponse,
  testErrorResponse,
} = require('../utils/requestHelpers.js');

// Modules for assertions
const { Event } = require('../utils/modules.js');

// Mock external modules
jest.mock('../../models/Event.js');

// Mock the authentication middleware for testing purposes.
jest.mock('../../middleware/userAuth', () => (req, res, next) => next());

// Test Suite for Event Registration
// Validation Error Tests
describe('Validation Errors', () => {
  const fieldTests = [
    { field: 'title', value: '', expectedMessage: 'Missing tittle' },
    { field: 'description', value: '', expectedMessage: 'Missing Description' },
    { field: 'category', value: '', expectedMessage: 'Missing Category' },
    { field: 'venue', value: '', expectedMessage: 'Missing Venue' },
    { field: 'startDate', value: '', expectedMessage: 'Missing Start Date' },
    { field: 'startDate', value: 'Invalid Start Date', expectedMessage: 'Invlid Start Date' },
    { field: 'startTime', value: '', expectedMessage: 'Missing Start Time' },
    { field: 'startTime', value: 'Invalid Start Time', expectedMessage: 'Invlid Start Time' },
    { field: 'endDate', value: '', expectedMessage: 'Missing End Date' },
    { field: 'endDate', value: 'Invalid', expectedMessage: 'Invlid End Date' },
    { field: 'endTime', value: '', expectedMessage: 'Missing End Time' },
    { field: 'endTime', value: 'Invalid Start Time', expectedMessage: 'Invlid End Time' },
    { field: 'participantsCount', value: '', expectedMessage: 'Missing Participants Count' },
  ];

  testMissingOrInvalidField('/api/event/register', eventData, fieldTests);
});

// Successful Registration Test
describe('Successful Registration', () => {
  it('should register event successfully', async () => {
    await testSuccessfulRegistration({
      app,
      endpoint: '/api/event/register',
      baseData: eventData,
      Model: Event,
      successMessage: `Succsfully fill form`
    });
  });
});

// Duplicate Event Test
describe('Duplicate Event', () => {
  it('should return 400 if event already exists', async () => {
    await testDuplicateErrorResponse({
      app,
      endpoint: '/api/event/register',
      payload: eventData,
      Model: Event,
      existingRecord: eventData,
      expectedMessage: 'Event title exists',
    });
  });
});

// Error Handling Test
describe('Error Handling', () => {
  it('should return 400 with an error message if something goes wrong', async () => {
    await testErrorResponse({
      app,
      endpoint: '/api/event/register',
      payload: eventData,
      Model: Event,
      errorMessage: 'Database failure',
      status: 400
    });
  });
});