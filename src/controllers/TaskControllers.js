const Task = require ('../models/taskModel');
const HttpStatusCode = require('../utils/httpStatusCode');
const AppError = require('../utils/appError'); 
const catchAsync = require('../utils/catchAsync');
const { request } = require('express');

const tasks = [
  { 
    text: 'do laundry',
    day: 'july 12th at 10:00 AM',
    reminder: true
  },
  {  
    text: 'buy groceries',
    day: 'july 12th at 11:00 AM',
    reminder: false
  },
  {  
    text: 'clean the house',
    day: 'july 12th at 12:00 PM',
    reminder: true
  },
  {  
    text: 'Buy a dog',
    day: 'july 13th at 4:00 PM',
    reminder: true
  },
  {  
    text: 'Buy a ball',
    day: 'july 14th at 12:00 PM',
    reminder: true
  },
  {  
    text: 'Buy a car',
    day: 'july 16th at 2:00 PM',
    reminder: false
  }
]

const getAllTasks = catchAsync (async (req, res, next) =>  {
  const query = Task.find({});
  const result = await query.select('-__v'); // Exclude the __v field from the results

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    results: result.length,
    requestTime: req.requestTime,
    data: {
      tasks: result
    }
     
  });


  
  })


const getTask =  catchAsync(async (req, res, next) => {

  const taskId = req.params.id;
  const query = Task.findById(taskId);
  const task = await query.select('-__v'); // Exclude the __v field from the result
  //const id = parseInt(req.params.id);
  //const task = tasks.find(task => task.id === id);
  //console.log('task');

    res.status(HttpStatusCode.OK).json({
      status: 'success',
      results: 1,
      requestTime: req.requestTime,
      data: {
        tasks: task
      }
    });


  });

  const createTask = catchAsync (async (req, res, next) => {
    const body = req.body;
      // handle date conversion and validation
  let taskDate;
  if (body.day) {

    taskDate = new Date(body.day);
    // Validate the date format
    if (isNaN(taskDate.getTime())) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        status: 'fail',
        message: 'Invalid date format.  Please use ISO format like "2025-07-17T16:00:00"'
      });
    }
  }

  const newTask = await Task.create({
    text: body.text,
    day: taskDate, // use converted date
    reminder: body.reminder
  });

  
  res.status(HttpStatusCode.CREATED).json({
    status: 'success',
  
    data: {
      task: newTask
    }
  });
  });


const updateTask = catchAsync (async (req, res, next) => {

  // handle date conversion and validation
  const taskId = req.params.id;
  const task = await Task.findByIdAndUpdate(taskId, req.body, {
    new: true,
  });
  //console.log(task);
   // {
//   const id = parseInt(req.params.id);
//   if (id < 1 || id > tasks.length) {
//     return res.status(HttpStatusCode.NOT_FOUND).json({
//       status: 'fail',
//       message: 'Task not found'
//     });
//   }
//   tasks[id - 1].text = req.body.text;
//   tasks[id - 1].day = req.body.day;
//   tasks[id - 1].reminder = req.body.reminder; 

// const task = tasks.find(task => task.id === id);

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: {
      task
    }
  });

  });


const deleteTask = catchAsync (async (req, res, next) => {
  const taskId = req.params.id;
  const task = await Task.findByIdAndDelete(taskId);
  //console.log(task);

  // const id = parseInt(req.params.id);

  // if (!tasks[id - 1]) {
  //   return res.status(HttpStatusCode.NOT_FOUND).json({
  //     status: 'fail',
  //     message: 'Task not found'
  //   });
  // }

  // tasks.splice(id - 1, 1); // Remove the task from the array


  res.status(HttpStatusCode.NO_CONTENT).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
