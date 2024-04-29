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
eventRouter.delete("/events/:id", verifyToken, eventController.deleteEvent);
eventRouter.get("/events", eventController.listEvents);
eventRouter.get("/join/:id", verifyToken, eventController.reqJoinEvent);
eventRouter.get("/request/", verifyToken, eventController.allJoinRequest);
eventRouter.get(
  "/request/:id/:status",
  verifyToken,
  eventController.eventReqUpdate,
);
eventRouter.get("/comments/:id", eventController.getComments);
eventRouter.post("/comments", verifyToken, eventController.createComment);

module.exports = eventRouter;
