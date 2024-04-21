// Import pg library
const { Pool } = require('pg');

// Initialize PostgreSQL connection pool
const openDb = () => {
    const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "event_manager",
        password: "root",
        port: 5432
    });
    return pool;
}


//create event 
const createEvent = (req, res) => {
  const eventData = req.body;
  const sql = 'INSERT INTO events SET ?';

  db.query(sql, eventData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating event');
    } else {
      res.status(201).send('Event created successfully');
    }
  });
};


//update event 
const updateEvent = (req, res) => {
  const eventId = req.params.id;
  const updatedEventData = req.body;
  const sql = 'UPDATE events SET ? WHERE id = ?';

  db.query(sql, [updatedEventData, eventId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating event');
    } else {
      res.status(200).send('Event updated successfully');
    }
  });
};

//delete event 
const deleteEvent = (req, res) => {
  const eventId = req.params.id;
  const sql = 'DELETE FROM events WHERE id = ?';

  db.query(sql, eventId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting event');
    } else {
      res.status(200).send('Event deleted successfully');
    }
  });
};


//list event 
const listEvents = (req, res) => {
  const sql = 'SELECT * FROM events';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error listing events');
    } else {
      res.status(200).json(results);
    }
  });
};



// Function to add a user to an event
const joinEvent = async (req, res) => {
    const { userId, eventId } = req.body;
  
    try {
      // Check if the event exists
      const eventExists = await pool.query('SELECT id FROM events WHERE id = $1', [eventId]);
      if (eventExists.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
  
      // Check if the user is already a participant in the event
      const participantExists = await pool.query('SELECT id FROM participants WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
      if (participantExists.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'User already joined the event' });
      }
  
      // Add user to event participants array
      await pool.query('UPDATE events SET participants = array_append(participants, $1) WHERE id = $2', [userId, eventId]);
      res.status(200).json({ success: true, message: 'User joined event successfully' });
    } catch (error) {
      console.error('Error joining event:', error);
      res.status(500).json({ success: false, message: 'Failed to join event' });
    }
  }

// Function to remove a user from an event
const leaveEvent = async (req, res) => {
    const { userId } = req.body;
    const eventId = req.params.eventId;
  
    try {
      // Check if the event exists
      const eventExists = await pool.query('SELECT id FROM events WHERE id = $1', [eventId]);
      if (eventExists.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
  
      // Check if the user is a participant in the event
      const participantExists = await pool.query('SELECT id FROM participants WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
      if (participantExists.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'User is not a participant in the event' });
      }
  
      // Remove user from event participants array
      await pool.query('UPDATE events SET participants = array_remove(participants, $1) WHERE id = $2', [userId, eventId]);
      res.status(200).json({ success: true, message: 'User left event successfully' });
    } catch (error) {
      console.error('Error leaving event:', error);
      res.status(500).json({ success: false, message: 'Failed to leave event' });
    }
  }

module.exports = {
  joinEvent,
  leaveEvent,
};