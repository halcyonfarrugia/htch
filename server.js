const express = require('express');
require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose')
var bodyParser = require('body-parser');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
    limit:'50mb',
    parameterLimit: 50000
}));

mongoose.connect(process.env.MONGO_URI)
    .then(res => console.log('MongoDB connected.'))
    .catch(error => {
        console.log('Failed to connect to DB')
        console.log('Error ', error)
    })

app.use('/api/auth', require('./routes/auth'))
app.use('/api/product', require('./routes/product'))
app.use('/api/order', require('./routes/order'))
app.use('/api/user', require('./routes/user'))

app.listen(process.env.PORT, () => console.log(`Server listening at ${process.env.PORT}`))