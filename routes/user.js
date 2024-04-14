const express = require('express');
const { query } = require('../helpers/db.js');
const bcrypt = require('bcrypt');

const userRouter = express.Router();

userRouter.post("/login",async(req, res) => {
    try {
        const sql = 'select * from "user" where email=$1'
        const result = await query(sql,[req.body.email]);
        if(result.rowCount === 1) {
            bcrypt.compare(req.body.password,result.rows[0].password, (err,bcrypt_res) => {
                if(!err) {
                    if(bcrypt_res === true) {
                        const user = result.rows[0]
                        res.status(200).json({"id":user.id,"email":user.email})
                    } else {
                        res.statusMessage = 'Invalid login';
                        res.status(401).json({error: 'Invalid login'})
                    }
                } else {
                    res.statusMessage = err;
                    res.status(500).json({error: err})
                }
            })
        } else {
            res.statusMessage = 'Invalid login';
            res.status(401).json({error: 'Invalid login'});
        } 
    } catch (error) {
        res.statusMessage = error;
        res.status(500).json({error: error});
    }
});

userRouter.post("/register", async(req, res) => {
    console.log('from register backend')
    console.log('password in backedn is: ',req.body.password)
    console.log('type of password is: ',typeof(req.body.password))
    bcrypt.hash(req.body.password,10,async (err, hash) => {
        console.log('the has password is: ',hash)
        console.log('type of hash is: ',typeof(hash))
        if(!err) {
            console.log('no error:**********')
            try {
                const sql = 'insert into "user" (firstname, lastname, dob, email, password) values ($1,$2,$3,$4,$5) returning id';
                console.log('first')
                const result = await query(sql,[req.body.firstname,req.body.lastname,req.body.dob,req.body.email,hash]);
                console.log('second')
                res.status(200).json({id: result.rows[0].id});
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