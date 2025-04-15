const express = require('express');
const router = express.Router();

router.use((req, res, next)=>{
    console.log(`Users API - ${req.method} , ${req.originalUrl}`)
    next();
})

router.get('/', (req, res)=>{
    res.send("All users")
});

router.post('/', (req, res)=>{
    res.send('create new user')
    console.log(req.body)
});


module.exports = router;