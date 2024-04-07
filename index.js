const express = require('express');
const cors = require('cors');
const { userRouter } = require('./routes/user');
const { eventRoutes } = require('./routes/eventRoutes');


const port = 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use('/user',userRouter);
app.use('/api', eventRoutes); // Mounts event routes

app.listen(port,() => {
    console.log(`Server is listening on port ${port}`);
});