const cors = require('cors');
const express = require('express')
const router = require('./routes/router')
const errorHandler = require('./middlewares/errorHandler')
require('./config/dbConnect')
const app = express()
const port = 3000
const path = require('path');

app.use(cors(
    {
        origin : true,
        credentials : true
    }
));

app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
app.use('/media',express.static(path.join(__dirname, 'media')));
app.use('/api',router)
app.use(errorHandler)


app.listen(port)