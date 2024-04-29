const express = require("express");
const { pool } = require("../helpers/db.js");
const reviewsRouter = express.Router();

// Route to get all reviews
reviewsRouter.get("/get", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM reviews");
    const reviews = result.rows;
    res.json(reviews);
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to create a new review
reviewsRouter.post("/post", async (req, res) => {
  const { title, description, rating, datetime, user_id, event_id } = req.body;
  if (!user_id || !event_id || !title || !description || !rating || !datetime) {
    return res.status(400).json({
      error: "User ID, event ID, title, description, and rating are required",
    });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO reviews (title, description, rating, datetime, user_id, event_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, rating, datetime, user_id, event_id],
    );
    const newReview = result.rows[0];
    res.status(201).json(newReview);
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to update a review
reviewsRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, rating, datetime } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE reviews SET title = $1, description = $2, rating = $3, datetime = $4 WHERE id = $5 RETURNING *",
      [title, description, rating, datetime, id],
    );
    const updatedReview = result.rows[0];
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(updatedReview);
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a review
reviewsRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM reviews WHERE id = $1 RETURNING *",
      [id],
    );
    const deletedReview = result.rows[0];
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted successfully", review: deletedReview });
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  reviewsRouter,
};
