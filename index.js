const express = require('express');
const cors = require('cors');
const path = require('path');
const upload = require('./helpers/storage');
const { userRouter } = require('./routes/user.js');
const eventRouter = require('./routes/eventRoutes.js');
const { notificationRouter } = require('./routes/notifications');
const { reviewsRouter } = require('./routes/reviews');


const port = 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/user', userRouter);
app.use(eventRouter);
app.use('/notification',notificationRouter);
app.use('/review',reviewsRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});