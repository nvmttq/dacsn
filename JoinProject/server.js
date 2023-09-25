
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());


// ROUTES
const route = require('./routes/index.js');
route(app);




const URI = process.env.MONGODB_URL

// CONNECT DATABASE
const connectDb = require("./db.js");
connectDb()


const port = process.env.PORT || 3002
app.listen(port, () => {
    console.log("SEVER RUNNING ON PORT", port);
})