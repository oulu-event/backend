const express = require('express');
const cors = require('cors');
const { userRouter } = require('./routes/user.js');
const { eventRouter } = require('./routes/events.js');


const port = 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/user', userRouter);
app.use('/events', eventRouter);
// app.use('/api', eventRoutes);

app.listen(port,() => {
    console.log(`Server is listening on port ${port}`);
});