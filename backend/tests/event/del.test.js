const request = require('supertest');
const app = require('../../app.js');
const { testMissingOrInvalidField } = require('../utils/validationHelpers.js');

// Import data for testing
const {
  eventData,
  invalidTitles,
  invalidDescriptions,
  invalidCategories,
  invalidVenues,
  invalidStartDates,
  invalidStartTimes,
  invalidEndDates,
  invalidEndTimes,
  invalidParticipantsCounts
} = require('../data/testEvents.js');

// Import reusable request helpers
const { 
  testSuccessfulRegistration,
  testDuplicateErrorResponse,
  testErrorResponse,
  testFieldWithValues,
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
  describe('Missing Fields', () => {
    const fieldTests = [
     { field: 'title', value: '', expectedMessage: 'Missing tittle' },
     { field: 'description', value: '', expectedMessage: 'Missing Description' },
     { field: 'category', value: '', expectedMessage: 'Missing Category' },
     { field: 'venue', value: '', expectedMessage: 'Missing Venue' },
     { field: 'startDate', value: '', expectedMessage: 'Missing Start Date' },
     { field: 'startTime', value: '', expectedMessage: 'Missing Start Time' },
     { field: 'endDate', value: '', expectedMessage: 'Missing End Date' },
     { field: 'endTime', value: '', expectedMessage: 'Missing End Time' },
     { field: 'participantsCount', value: '', expectedMessage: 'Missing Participants Count' },
    ];

    testMissingOrInvalidField('/api/event/register', eventData, fieldTests);
  })

  describe('Invalid Fields', () => {
    const invalidValues = {
        // title: invalidTitles,
        // description: invalidDescriptions,
        // category: invalidCategories,
        // venue: invalidVenues,
        startDate: invalidStartDates,
        startTime: invalidStartTimes,
        endDate: invalidEndDates,
        endTime: invalidEndTimes,
        //participantsCount: invalidParticipantsCounts
    };

    for (const [field, values] of Object.entries(invalidValues)) {
        values.forEach(({ value, expectedMessage }) => {
          it(`should return 400 when ${field} is "${value}"`, async () => {
             const payload = { ...eventData, [field]: value };
             const response = await request(app).post('/api/event/register').send(payload);
             expect(response.statusCode).toBe(400);
             expect(response.body).toHaveProperty('message', expectedMessage);
          });
        });
    }
  });
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