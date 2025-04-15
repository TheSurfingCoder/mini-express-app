const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');


const port = process.env.PORT || 3000;
let tasks = [];


//Load env, DB, and setup middleware
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const uri = "mongodb+srv://matthewmctighe1:MbEuDtddInbUx3nQ@mini-express-app.bnjhqr7.mongodb.net/?appName=mini-express-app";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
run().catch(console.dir);

//custom middleware
const requestLogger = function (req, res, next) {
    const startTime = new Date();
    res.on("finish", () => {
        const { method, originalUrl } = req;
        const { statusCode } = res;
        console.log(`[${startTime}] ${method} ${originalUrl} ${statusCode}`);
    });
    next();
};

app.use(requestLogger);



// Declaring Middleware functions



//Static Files
app.use(express.static(path.join(__dirname, 'public')));


// Routes
const userRouter = require('./api/users');
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
    console.log("Root route accessed");
    res.send("Hello world");
});

app.post('/submit-form', (req, res) => {
    console.log(req.body);
    res.send('form has been submitted');
});

app.post('/tasks', (req, res) => {
    const task = { id: new Date(), ...req.body };
    tasks.push(task);
    res.status(201).json(task);
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/error', (req, res) => {
    throw new Error('Boom!');
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
