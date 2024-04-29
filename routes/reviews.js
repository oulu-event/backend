const express = require('express');
const { pool } = require('../helpers/db.js');
const reviewsRouter = express.Router();

reviewsRouter.get('/get', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM reviews');
    const reviews = result.rows;
    res.json(reviews);
    client.release()
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

reviewsRouter.post('/post', async (req, res) => {
  const { title, description, rating, datetime, user_id, event_id } = req.body;
  if (!user_id || !event_id || !title || !description || !rating || !datetime) {
      return res.status(400).json({ error: 'User ID, event ID, title, description, and rating are required' });
  }

  try {
      const client = await pool.connect();
      const result = await client.query(
          'INSERT INTO reviews (title, description, rating, datetime, user_id, event_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [title, description, rating, datetime, user_id, event_id]
      );
      const newReview = result.rows[0];
      res.status(201).json(newReview);
      client.release()
  } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = {
  reviewsRouter
}