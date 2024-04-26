const express = require('express');
const { query } = require('../helpers/db.js');
const reviewsRouter = express.Router();

reviewsRouter.get('/get', async (req, res) => {
  try {
    const result = await query('SELECT * FROM reviews');
    const reviews = result.rows;
    res.json(reviews);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

reviewsRouter.post('/post', async (req, res) => {
  const { user_id, event_id, title, description, rating } = req.body;
  if (!user_id || !event_id || !title || !description || !rating) {
      return res.status(400).json({ error: 'User ID, event ID, title, description, and rating are required' });
  }

  try {
      const result = await query(
          'INSERT INTO reviews (user_id, event_id, title, description, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [user_id, event_id, title, description, rating]
      );
      const newReview = result.rows[0];
      res.status(201).json(newReview);
  } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = {
  reviewsRouter
}