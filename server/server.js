
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = require('./dbConnection');

db.sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

const redisClient = require('./cacheConnection');
redisClient.connect();

const searchRoute = require('./routes/searchRoutes')

app.get('/', (req, res) => { res.send('<h1>Hello, web application server</h1>');});
app.use('/search', searchRoute);

const port = process.env.PORT || 3001;
app.listen(port, console.log(`Server is running on port ${port}`));