// Import required modules
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const commentController = require('../controllers/commentController');

// POST request to join an event
router.post('/events/:eventId/join', eventController.joinEvent);

// POST request to leave an event
router.post('/events/:eventId/leave', eventController.leaveEvent);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.get('/events', eventController.listEvents);

// COMMENT routers here:

// POST request to create a comment on an event
router.post('/events/:eventId/comments', commentController.createComment);

// GET request to retrieve all comments for an event
router.get('/events/:eventId/comments', commentController.getCommentsByEventId);

// POST request to add a comment to a specific event
router.post('/events/:eventId/comments', commentController.addComment);

// GET request to retrieve all comments for a specific event
router.get('/events/:eventId/comments', commentController.getCommentsForEvent);

// DELETE request to delete a comment on an event
router.delete('/events/:eventId/comments/:commentId', commentController.deleteComment);

module.exports = router;
