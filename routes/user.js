const express = require('express');
const { query } = require('../helpers/db.js');
const bcrypt = require('bcrypt');

const userRouter = express.Router();

userRouter.post("/login", async (req, res) => {
    try {
        const sql = 'select * from "user" where email=$1';
        const result = await query(sql, [req.body.email]);
        console.log('from login');
        console.log(result.rows[0])
        console.log('hased password is:', result.rows[0].password);
        console.log('hased password is:', String(result.rows[0].password).trim());
        console.log('type of password is:',typeof(result.rows[0].password));
        console.log(req.body.password)
        if (result.rowCount === 1) {
            if(req.body.password === result.rows[0].password) {
                console.log('login successfull')
                const user = result.rows[0];
                res.status(200).json({ "id": user.id, "email": user.email });
            }
            else {
                console.log('login failed')
                res.statusMessage = 'Invalid login';
                res.status(401).json({ error: 'Invalid login' });
            }
            // bcrypt.compare(req.body.password, result.rows[0].password, (err, bcrypt_res) => {
            //     if (!err) {
            //         if (bcrypt_res === true) {
            //             console.log('password is true');
            //             const user = result.rows[0];
            //             res.status(200).json({ "id": user.id, "email": user.email });
            //         } else {
            //             console.log('password is false');
            //             console.log(bcrypt_res)
            //             res.statusMessage = 'Invalid login';
            //             res.status(401).json({ error: 'Invalid login' });
            //         }
            //     } else {
            //         console.log('else error')
            //         res.statusMessage = err;
            //         res.status(500).json({ error: err });
            //     }
            // });
        } else {
            res.statusMessage = 'Invalid login';
            res.status(401).json({ error: 'Invalid login' });
        }
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({ error: error });
    }
});

userRouter.post("/register", async(req, res) => {
    console.log('from register backend')
    console.log('password in backedn is: ',req.body.password)
    console.log('type of password is: ',typeof(req.body.password))
    const salt = await bcrypt.genSalt(10);
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
        // console.log('the has password is: ',hash)
        // console.log('type of hash is: ',typeof(hash))
        if(!err) {
            console.log('no error:**********')
            try {
                const sql = 'insert into "user" (firstname, lastname, dob, email, password) values ($1,$2,$3,$4,$5) returning id';
                console.log('first')
                const result = await query(sql, [req.body.firstname, req.body.lastname, req.body.dob, req.body.email, req.body.password]);
                console.log('second')
                console.log(result.rows[0].id)
                res.status(200).json({id: result.rows[0]});
            } catch (error) {
                console.log('got error in user.js')
                console.log(error.message)
                res.statusMessage = error;
                res.status(500).json({error: error});
            }
        } else {
            console.log('got error:**********')
            console.log(err)
            res.statusMessage = err;
            res.status(500).json({error: err});
        }
    })
});

module.exports = {
    userRouter
}