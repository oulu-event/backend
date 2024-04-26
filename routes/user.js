const express = require('express');
const { pool } = require('../helpers/db.js');
const {encryptPassword, checkPassword, generateToken} = require('../helpers/authHelper.js');


const userRouter = express.Router();

userRouter.post("/login", async (req, res) => {
    console.log('data : ', req.body)
    const {email, password } = req.body;

    // validation
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const client = await pool.connect();
        
        // Check if if any user exists
        const userWithEmail = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userWithEmail.rows.length < 0) {
            return res.status(400).json({ error: 'No user found' });
        }else{
            const user = userWithEmail.rows[0]
            const passCheck = await checkPassword(password, user.password);
            if(passCheck){
                const token= await generateToken(user);
                res.status(200).json({ message: 'User logged in successfully', token: token});
            }else{
                res.status(400).json({ message: 'Invalid credentials'});
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRouter.post("/register", async (req, res) => {
    console.log('data : ', req.body)
    const { firstname, lastname, dob, email, password } = req.body;

    // validation
    if (!firstname || !lastname || !dob || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const client = await pool.connect();
        // Check if email is already registered
        const userWithEmail = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userWithEmail.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Encrypt the password
        const hashedPassword = await encryptPassword(password);

        // Insert user into the database
        const newUser = await client.query(
            'INSERT INTO users (firstname, lastname, dob, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstname, lastname, dob, email, hashedPassword]
        );
        client.release();

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = {
    userRouter
}