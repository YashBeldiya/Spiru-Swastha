const cors = require('cors');
const express = require('express')
const router = require('./routes/router')
const errorHandler = require('./middlewares/errorHandler')
require('./config/dbConnect')
const app = express()
const port = 3000
const path = require('path');
const connectDB = require('./config/dbConnect')

app.use(cors(
    {
        origin : true,
        credentials : true
    }
));

app.use(express.json())
app.get('/', (req, res) => {
    res.send({ success: true, message: 'Backend API is working' });
  });
// app.use(express.urlencoded({ extended: true }));
app.use('/media',express.static(path.join(__dirname, 'media')));
app.use('/api',router)
app.use((req, res) => {
    return res.status(404).json({ success: false, message: "Invalid API Path" });
});
app.use(errorHandler)


connectDB();
app.listen(port)