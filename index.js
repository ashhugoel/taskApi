const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');


const app = express();
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://temp:fVzlDtdZRNXoOb4E@cluster0.n545xqu.mongodb.net/userDB'); //THIS WOULD BE CLOSED AFTER USE 


app.use('/api', authRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
