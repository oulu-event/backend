const express = require('express');
const { query } = require('../helpers/db.js');
const router = express.Router();

router.get('/notification/get', async (req, res) => {
  try {
    // Query notifications
    const result = await query('SELECT * FROM notification');
    const notifications = result.rows;
    res.json(notifications);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new notification
router.post('/notification/post', async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
  
    try {
      const result = await query(
        'INSERT INTO notification (title, description) VALUES ($1, $2) RETURNING *',
        [title, description]
      );
      const newNotification = result.rows[0];
      res.status(201).json(newNotification);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = {
    router
}