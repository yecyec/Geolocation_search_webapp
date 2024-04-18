const  { createClient } = require('redis');

const redisClient = createClient()

redisClient.on('connect', function() {
    console.log('Connected!');
});

redisClient.on('error', (error) => {
    console.log(`Redis client encountered an error: ${error}`);
})


module.exports = redisClient;