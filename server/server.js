
const express = require('express');
const cors = require('cors');
const db = require('./src/repository/dbConnection');
const redisClient = require('./src/repository/cacheConnection');
const searchRoute = require('./src/routes/searchRoutes')

// Initialize the server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Establish connection to the database 
db.sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

// Establish connection to the Redis 
redisClient.connect();

// Routes
app.get('/', (req, res) => { res.send('<h1>Hello, web application server</h1>'); });
app.use('/search', searchRoute);

// Run the server
const port = process.env.PORT || 3001;
app.listen(port, console.log(`Server is running on port ${port}`));