// Import required modules
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// POST request to join an event
router.post('/events/:eventId/join', eventController.joinEvent);

// POST request to leave an event
router.post('/events/:eventId/leave', eventController.leaveEvent);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.get('/events', eventController.listEvents);

module.exports = router;
