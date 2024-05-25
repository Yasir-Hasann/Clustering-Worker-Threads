// module imports
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

// file imports
const errorHandler = require('./middlewares/error-handler');

// variable initializations
const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// mount routes
app.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Testing' });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

console.log(process.env.NODE_ENV.toUpperCase());
