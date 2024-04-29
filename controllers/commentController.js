/* 

  YOU CAN MOVE THIS INTO "eventController.js"
  IF THAT IS THE CORRECT WAY. I wasn't sure if
  it should be here on it's own or in eventController.js
  (It's some functions to make the comments work, I hope.)
  
  ~ Ville */

// Function to create a comment on an event
const createComment = async (req, res) => {
  const { eventId } = req.params;
  const { userId, content } = req.body;

  try {
    // Insert the comment into the database
    const queryText =
      "INSERT INTO comments (event_id, user_id, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [eventId, userId, content];
    const result = await pool.query(queryText, values);

    // Send the newly created comment in the response
    res.status(201).json({ success: true, comment: result.rows[0] });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create comment" });
  }
};

// Function to fetch all comments for an event
const getCommentsByEventId = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Fetch all comments associated with the specified event ID
    const queryText = "SELECT * FROM comments WHERE event_id = $1";
    const result = await pool.query(queryText, [eventId]);

    // Send the comments in the response
    res.status(200).json({ success: true, comments: result.rows });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments" });
  }
};

// Function to add a comment
const addComment = async (req, res) => {
  const { eventId } = req.params;
  const { text, userId } = req.body;

  try {
    // Insert the new comment into the database
    const queryText =
      "INSERT INTO comments (event_id, user_id, text) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(queryText, [eventId, userId, text]);

    // Send a success message along with the added comment in the response
    res
      .status(201)
      .json({
        success: true,
        message: "Comment added successfully",
        comment: result.rows[0],
      });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

// Function to retrieve all comments for a specific event
const getCommentsForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Fetch all comments associated with the event from the database
    const queryText = "SELECT * FROM comments WHERE event_id = $1";
    const result = await pool.query(queryText, [eventId]);

    // Send the retrieved comments in the response
    res.status(200).json({ success: true, comments: result.rows });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve comments" });
  }
};

// Function to delete a comment on an event
const deleteComment = async (req, res) => {
  const { eventId, commentId } = req.params;

  try {
    // Delete the comment from the database
    const queryText = "DELETE FROM comments WHERE event_id = $1 AND id = $2";
    const values = [eventId, commentId];
    const result = await pool.query(queryText, values);

    // Check if a comment was deleted
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Send a success message in the response
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete comment" });
  }
};

module.exports = {
  createComment,
  getCommentsByEventId,
  addComment,
  getCommentsForEvent,
  deleteComment,
};
