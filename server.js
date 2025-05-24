const express= require('express');
const app= express();
require('dotenv').config();

app.use(express.json());

const port= process.env.PORT || 5000

app.get('/', (req, res)=>{
    res.send('Jai Shree Ram');
})

app.get('/backend', (req, res)=>{
    res.send('Welcome to the Backend Development !');
})

require('./config/db');

app.use('/api/users', require('./routes/user'));


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})