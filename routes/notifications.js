const express = require('express');
const { pool } = require('../helpers/db.js');
const notificationRouter = express.Router();

notificationRouter.get('/get', async (req, res) => {
  try {
    const client = await pool.connect();
    // Query notifications
    const result = await client.query('SELECT * FROM notification');
    const notifications = result.rows;
    res.json(notifications);
    client.release()
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new notification
notificationRouter.post('/post', async (req, res) => {
    const { title, description, datetime, user_id } = req.body;
    if (!title || !description || !datetime || !user_id) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
  
    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO notification (title, description, datetime, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, datetime, user_id]
      );
      const newNotification = result.rows[0];
      res.status(201).json(newNotification);
      client.release()
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = {
  notificationRouter
}