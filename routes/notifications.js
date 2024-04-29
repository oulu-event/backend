const express = require("express");
const { pool } = require("../helpers/db.js");
const notificationRouter = express.Router();

// Route to get all notifications
notificationRouter.get("/get", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM notification");
    const notifications = result.rows;
    res.json(notifications);
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to create a new notification
notificationRouter.post("/post", async (req, res) => {
  const { title, description, datetime, user_id } = req.body;
  if (!title || !description || !datetime || !user_id) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO notification (title, description, datetime, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, datetime, user_id],
    );
    const newNotification = result.rows[0];
    res.status(201).json(newNotification);
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route to update a notification
notificationRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, datetime } = req.body;

  if (!title || !description || !datetime) {
    return res.status(400).json({
      error: "Title, description and datetime are required",
    });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE notification SET title = $1, description = $2, datetime = $3 WHERE id = $4 RETURNING *",
      [title, description, datetime, id],
    );
    const updatedNotification = result.rows[0];
    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(updatedNotification);
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a notification
notificationRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM notification WHERE id = $1 RETURNING *",
      [id],
    );
    const deletedNotification = result.rows[0];
    if (!deletedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
    client.release();
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  notificationRouter,
};
