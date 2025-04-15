const express = require('express');
const app = express();
const userRouter = require('./api/users')

const port = 3000;

let tasks = [];


const requestLogger = function(req,res, next){
    const startTime = new Date();

    res.on("finish", ()=>{
        const {method, originalUrl} = req;
        const {statusCode} = res;

        console.log(`[${startTime}]${method}${originalUrl}${statusCode}`)
    } )

    next();

}

function logOriginalUrl (req, res, next) {
    console.log('Request URL:', req.originalUrl)
    next()
  }
  
  function logMethod (req, res, next) {
    console.log('Request Type:', req.method)
    next()
  }

  const logStuff = [logOriginalUrl, logMethod]


app.use(requestLogger);
app.use(express.json());
app.use('/api/users', userRouter);
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


 
  
  app.get('/user/:id', logStuff, (req, res, next) => {
    res.send('User Info')
  })


app.post('/submit-form', (req, res)=>{
    console.log(req.body);
    res.send('form has been submitted')
});


app.get('/', (req, res) => {
    console.log("Root route accessed");
    res.send("Hello world");
});

app.get('/example/b', (req, res, next) => {
    console.log('the response will be sent by the next function ...')
    next()
  }, (req, res) => {
    res.send('Hello from B!')
  })

app.listen(port, () => {
    console.log(`Example app is listening on port ${port}`)
});



app.post('/login', (req, res)=>{
    console.log(req.body);
    res.send(req.body);
})


app.post('/tasks', (req, res)=>{
    const task = {id: new Date, ...req.body}
    tasks.push(task);


    res.status(201).json(task);
})

app.get('/tasks', (req,res)=>{
    res.json(tasks)
})

app.get('/error', (req, res) => {
    throw new Error('Boom!');
  });
  