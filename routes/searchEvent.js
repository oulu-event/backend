const express = require("express");
const { query } = require("../helpers/db.js");

const searchRouter = express.Router();

searchRouter.post("/search", async (req, res) => {
    try {
        const sql = `select * from "event" where title like $1`;
        const value = "%"+req.body.searchString+"%";
        const result = await query(sql, [value]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({error: error});
    }
})

module.exports = {
    searchRouter
}