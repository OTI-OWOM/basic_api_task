const express = require('express');
const HttpStatusCode = require('./utils/httpStatusCode');
const {getAllTasks, getTask, createTask, updateTask, deleteTask} = require('./controllers/TaskControllers');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Task = require('./models/taskModel');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrorHandler.JS');
const morgan = require('morgan');

dotenv.config(
  { path: './.env' }
);

const app = express();

app.use(express.json());

app.use(morgan('common')); // Logging middleware for development

// Middleware to log request time
app.use((req, res, next) => {  
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

// express environment setup
//console.log(app.get('env'));

//node environment setup
//console.log(process.env.NODE_ENV);


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/api/v1/tasks/', getAllTasks); 

app.get('/api/v1/tasks/:id', getTask);

app.post('/api/v1/tasks/', createTask);

app.patch('/api/v1/tasks/:id', updateTask);


app.delete('/api/v1/tasks/:id', deleteTask);


app.use((req, res, next) => {
  // res.status(HttpStatusCode.NOT_FOUND).json({
  //   status: 'fail', 
  //   message: 'Route not found'
  // });

  // const err = new Error('Route not found');
  // err.statusCode = HttpStatusCode.NOT_FOUND;
  // err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server`, HttpStatusCode.NOT_FOUND));
});

// error handling middleware
app.use(globalErrorHandler);

// MongoDB connection setup
// Ensure you have the correct MongoDB connection string in your .env file
const DB_CONNECTION = process.env.MONGO_DB_CONNECTION.replace('Ezeogo25', process.env.MONGO_DB_PASSWORD);

// Connect to MongoDB using Mongoose
mongoose.connect(DB_CONNECTION).then(() => {
  console.log('DB connected successfully');
}).catch((err) => {
  console.error('Error connecting to DB:', err);
});



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Export the app for serverless deployment or testing
//module.exports = app;
