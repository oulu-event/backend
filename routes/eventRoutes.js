// Import required modules
const express = require("express");
const upload = require("../helpers/storage");
const { verifyToken } = require("../helpers/middleware");
const eventController = require("../controllers/eventController");
// const commentController = require('../controllers/commentController');

const eventRouter = express.Router();

eventRouter.post(
  "/events",
  verifyToken,
  upload.single("image"),
  eventController.createEvent,
);
eventRouter.put(
  "/events/:id",
  verifyToken,
  upload.single("image"),
  eventController.updateEvent,
);
eventRouter.get("/members/:id", eventController.getMembersOfEvent);
eventRouter.get("/events/:id", eventController.getEventOfParticularUser);
eventRouter.get("/events/joined/:id", eventController.getEventsJoinedByUser);
eventRouter.get("/events/leave/:eventId/:userId", eventController.leaveEvent);
eventRouter.get("/events/delete/:id", eventController.deleteEvent);
eventRouter.get("/events", eventController.listEvents);
eventRouter.get("/events/:userId/:eventId", eventController.checkIfUserJoinedEvent);
eventRouter.get("/join/:id", verifyToken, eventController.reqJoinEvent);
eventRouter.get("/request/:id", eventController.getAllRequestByUser);
eventRouter.get("/request/", verifyToken, eventController.allJoinRequest);
eventRouter.get(
  "/request/:id/:status",
  eventController.eventReqUpdate,
);
eventRouter.get("/comments/:id", eventController.getComments);
eventRouter.post("/comments", verifyToken, eventController.createComment);

module.exports = eventRouter;
