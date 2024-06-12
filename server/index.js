const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');

// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
});

pgClient.on('error', () => console.log('Lost PG connection'));

// Create table if it doesn't exist
pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));

// Redis client setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

// Retrieve all indices seen
app.get('/api/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

// Retrieve current values
app.get('/api/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

// Calculate Fibonacci number
app.post('/api/values', async (req, res) => {
    const { index } = req.body;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, (err) => {
    console.log('Listening on port 5000');
});
