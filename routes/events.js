const express = require('express');
const { query } = require('../helpers/db.js');
const eventRouter = express.Router();

eventRouter.get("/", async (req, res) => {
    try {
        const sql = 'select * from "event"';
        const result = await query(sql);
        console.log('backend all events:')
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

eventRouter.post("/add", async (req, res) => {
    try {
        const sql = 'insert into "event" (title, description, totalMembers) values ($1, $2, $3) returning *';
        const values = [req.body.title, req.body.description, req.body.totalMembers];
        const result = await query(sql, values);
        console.log('event added:')
        console.log(result.rows[0]);
        res.status(200).json({ message: 'Event added successfully', data: result.rows[0] });
    } catch (error) {
        console.log('got error at backend while adding event: ')
        console.log(error)
        res.status(500).json({ error: error });
    }
});

module.exports = {
    eventRouter
}