const { pool } = require("../helpers/db.js");
const {
  encryptPassword,
  checkPassword,
  generateToken,
} = require("../helpers/authHelper.js");

// get all members of that event
async function getMembersOfEvent(req, res) {
  const eventId = req.params.id;
  try {
    const client = await pool.connect();

    // get members from the database
    const members = await client.query(
      "SELECT users.* FROM join_request JOIN users ON join_request.user_id = users.id WHERE join_request.event_id = $1",
      [eventId],
    );
    client.release();

    // Respond with success message
    res.status(200).json({
      message: "Members retrieved successfully",
      data: members.rows,
    });
  } catch (error) {
    console.error("Error retrieving members:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}

//create event
async function createEvent(req, res) {
  const { name, location, datetime, description, total_participants_allowed } =
    req.body;

  console.log("inside create event");

  // validation
  if (!name || !location || !datetime || !description || !total_participants_allowed) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const imagePath = req.file ? req.file.path : null;
  try {
    const client = await pool.connect();

    // Insert event into the database
    const newEvent = await client.query(
      "INSERT INTO events (name, location, description, datetime, total_participants_allowed, photo, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        location,
        description,
        datetime,
        total_participants_allowed,
        imagePath,
        req.user.id,
      ],
    );
    client.release();

    // Respond with success message
    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//update event
async function updateEvent(req, res) {
  const eventId = req.params.id;
  const { name, location, datetime, description, total_participants_allowed } =
    req.body;

  // validation
  if (!name || !location || !datetime || !description || !total_participants_allowed) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const imagePath = req.file ? req.file.path : null;
  try {
    const client = await pool.connect();

    // Check if event exist
    const currentEvent = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId],
    );
    if (currentEvent.rows.length < 1) {
      return res.status(404).json({ error: "Event not found" });
    }

    // update event into the database
    const newEvent = await client.query(
      "UPDATE events SET name = $1, location = $2, description = $3, datetime = $4, total_participants_allowed = $5, photo = $6 WHERE id = $7 RETURNING *",
      [
        name,
        location,
        description,
        datetime,
        total_participants_allowed,
        imagePath,
        eventId,
      ],
    );
    client.release();

    // Respond with success message
    res.status(201).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// get all the events of a particular user
async function getEventOfParticularUser(req, res) {
  const userId = req.params.id;
  try {
    const client = await pool.connect();

    // get events from the database
    const events = await client.query("SELECT * from events WHERE user_id = $1", [
      userId,
    ]);
    client.release();

    // Respond with success message
    res
      .status(200)
      .json({ message: "Event retrieved successfully", data: events.rows });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// get all the events joined by a particular user
async function getEventsJoinedByUser(req, res) {
  const userId = req.params.id;
  try {
    const client = await pool.connect();

    // get events from the database
    const events = await client.query(
      "SELECT events.*, join_request.id as request_id, join_request.user_id as user_id, join_request.event_id as event_id, join_request.status as request_status FROM join_request JOIN events ON join_request.event_id = events.id WHERE join_request.user_id = $1",
      [userId],
    );
    client.release();

    // Respond with success message
    res
      .status(200)
      .json({ message: "Event retrieved successfully", data: events.rows });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Leave the event
async function leaveEvent(req, res) {
  const eventId = req.params.eventId;
  const userId = req.params.userId;
  try {
    const client = await pool.connect();

    // Check if event exist
    const currentEvent = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId],
    );
    if (currentEvent.rows.length < 1) {
      return res.status(404).json({ error: "Event not found" });
    }

    // delete event from the database
    const newEvent = await client.query(
      "DELETE FROM join_request WHERE event_id = $1 AND user_id = $2",
      [eventId, userId],
    );
    client.release();

    // Respond with success message
    res.status(200).json({ message: "Event left successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}

//delete event
async function deleteEvent(req, res) {
  const eventId = req.params.id;
  console.log('inside delete event:', eventId)
  try {
    const client = await pool.connect();

    // Check if event exist
    const currentEvent = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId],
    );
    if (currentEvent.rows.length < 1) {
      return res.status(404).json({ error: "Event not found" });
    }

    // delete event from the events table
    const newEvent = await client.query("DELETE FROM events WHERE id = $1", [
      eventId,
    ]);

    const newEvent2 = await client.query(
      "DELETE FROM join_request WHERE event_id = $1",
      [eventId],
    );

    client.release();

    // Respond with success message
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//list event
async function listEvents(req, res) {
  const { name, location } = req.query;
  let query = "SELECT * from events WHERE 1=1 ";
  const queryParams = [];
  if (name) {
    query += " AND name LIKE LOWER ( $1 )";
    queryParams.push(`%${name}%`);
  }
  if (location) {
    query += " AND location LIKE LOWER ( $2 )";
    queryParams.push(`%${location}%`);
  }

  try {
    const client = await pool.connect();

    // get events from the database
    const events = await client.query(query, queryParams);
    client.release();

    // Respond with success message
    res
      .status(200)
      .json({ message: "Event retrieved successfully", data: events.rows });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// check if user joined the event
async function checkIfUserJoinedEvent(req, res) {
  const userId = req.params.userId;
  const eventId = req.params.eventId;
  try {
    const client = await pool.connect();

    // get events from the database
    const events = await client.query(
      "SELECT * from join_request WHERE user_id = $1 AND event_id = $2",
      [userId, eventId],
    );
    client.release();

    // Respond with success message
    res
      .status(200)
      .json({ message: "Event retrieved successfully", data: events.rows });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// particular request by user
async function getAllRequestByUser(req, res) {
  try {
    let eventId = req.params.id;

    const client = await pool.connect();

    // get join requests from the database
    // "SELECT * from join_request where event_id = $1",
    const joinRequests = await client.query(
      "SELECT join_request.*, users.*, events.*, join_request.id as request_id FROM join_request JOIN users ON join_request.user_id = users.id JOIN events ON join_request.event_id = events.id WHERE join_request.event_id = $1",
      [eventId],
    );
    client.release();

    // Respond with success message
    res.status(200).json(joinRequests.rows);
  } catch (error) {
    console.error("Error retrieving join request:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}

//all join request
async function allJoinRequest(req, res) {
  try {
    const client = await pool.connect();

    // get join requests from the database
    const joinRequests = await client.query(
      "SELECT * from join_request where status = 0 ",
    );
    client.release();

    // Respond with success message
    res.status(200).json({
      message: "Join Request retrieved successfully",
      data: joinRequests.rows,
    });
  } catch (error) {
    console.error("Error retrieving join request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Request to join the event
async function reqJoinEvent(req, res) {
  const eventId = req.params.id;

  console.log('from reqJoinEvent, userId:', req.user.id)

  try {
    const client = await pool.connect();

    // Check if event exist
    const currentEvent = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId],
    );
    if (currentEvent.rows.length <= 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if there is already join request exist
    const checkReq = await client.query(
      "SELECT * FROM join_request WHERE user_id = $1 AND event_id = $2",
      [req.user.id, eventId],
    );
    console.log('checking user request:', checkReq.rows)
    if (checkReq.rows.length > 0) {
      return res.status(400).json({ error: "Already sent a join request" });
    }

    // Insert request data to save
    const newReq = await client.query(
      "INSERT INTO join_request (event_id, user_id, status) VALUES ($1, $2, $3) RETURNING *",
      [eventId, req.user.id, 0],
    );
    client.release();

    // Respond with success message
    res.status(200).json({ message: "Join request sent successfully" });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to approve or reject user for a event
async function eventReqUpdate(req, res) {
  const reqID = req.params.id;
  const status = req.params.status;

  console.log('from backend eventReqUpdate:', reqID, status)

  try {
    const client = await pool.connect();

    // Check if request exist
    const currentReq = await client.query(
      "SELECT * FROM join_request WHERE id = $1",
      [reqID],
    );
    if (currentReq.rows.length <= 0) {
      return res.status(404).json({ error: "Join Request not found" });
    }

    // update join request status into the database
    const newEvent = await client.query(
      "UPDATE join_request SET status = $1  WHERE id = $2 RETURNING *",
      [status, reqID],
    );

    // Save user to participant list
    // if (status == 1) {
    //   const newParticipant = await client.query(
    //     "INSERT INTO participants (event_id, user_id) VALUES ($1, $2) RETURNING *",
    //     [currentReq.rows[0].event_id, req.user.id],
    //   );
    // }

    client.release();

    // Respond with success message
    res.status(200).json({ message: "Join request processed successfully", data: newEvent.rows});
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to create a comment on an event
async function createComment(req, res) {
  const { event_id, content } = req.body;

  try {
    // Insert the comment into the database
    const queryText =
      "INSERT INTO comments (event_id, user_id, content, datetime) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [event_id, req.user.id, content, new Date()];
    const result = await pool.query(queryText, values);

    // Send the newly created comment in the response
    res.status(201).json({ success: true, comment: result.rows[0] });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create comment" });
  }
}

//Get comments by Event ID
async function getComments(req, res) {
  const eventId = req.params.id;
  try {
    const client = await pool.connect();

    // Check if event exist
    const currentEvent = await client.query(
      "SELECT * FROM events WHERE id = $1",
      [eventId],
    );
    if (currentEvent.rows.length < 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // get comments from the database
    const comments = await client.query(
      "SELECT comments.*, users.firstname FROM comments JOIN users ON comments.user_id = users.id WHERE comments.event_id = $1 ORDER BY comments.datetime ASC",
      [eventId],
    );
    client.release();

    // Respond with success message
    res.status(200).json({
      message: "Comments retrieved successfully",
      data: comments.rows,
    });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getMembersOfEvent,
  createEvent,
  getEventOfParticularUser,
  getEventsJoinedByUser,
  leaveEvent,
  updateEvent,
  deleteEvent,
  listEvents,
  checkIfUserJoinedEvent,
  allJoinRequest,
  getAllRequestByUser,
  reqJoinEvent,
  eventReqUpdate,
  getComments,
  createComment,
};
