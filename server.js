require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use('/auth', require('./routes/auth.route'));

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
