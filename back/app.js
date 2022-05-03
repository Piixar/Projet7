const express = require('express');
const userRoutes = require ('./routes/user');
const messageRoutes = require('./routes/messages');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/comments', commentRoutes)

module.exports = app;