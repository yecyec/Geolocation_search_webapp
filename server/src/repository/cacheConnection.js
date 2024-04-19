const { createClient } = require('redis');

// Initialze Redis client 
const redisClient = createClient();

// Redis client methods
redisClient.on('connect', () => {
  console.log('Connected!');
});

redisClient.on('error', (error) => {
  console.log(`Redis client encountered an error: ${error}`);
})

module.exports = redisClient;
