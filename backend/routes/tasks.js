import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();


// All task actions require the user to be logged in
router.use(requireAuth);


// --------------------------------------------------
// GET ALL TASKS
// --------------------------------------------------

router.get('/', async function (req, res) {
  try {
    const tasks = await Task.find({})
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {
    console.log('Failed to get tasks:', error);

    res.status(500).json({
      message: 'Failed to get tasks',
    });
  }
});


// --------------------------------------------------
// CREATE A NEW TASK
// --------------------------------------------------

router.post('/', async function (req, res) {
  try {
    const { title, description, dueDate } = req.body;

    let taskTitle = '';
    let taskDescription = '';

    if (typeof title === 'string') {
      taskTitle = title.trim();
    }

    if (typeof description === 'string') {
      taskDescription = description.trim();
    }

    if (!taskTitle) {
      return res.status(400).json({
        message: 'Task title is required.',
      });
    }


    // The creator is taken from the logged-in user's
    // authentication token at the time the task is created.
    const creatorName = req.userName;

    const newTask = {
      title: taskTitle,
      user: req.userId,
      createdBy: creatorName,
    };


    if (taskDescription) {
      newTask.description = taskDescription;
    }


    if (dueDate) {
      const selectedDueDate = new Date(dueDate);

      if (Number.isNaN(selectedDueDate.getTime())) {
        return res.status(400).json({
          message: 'Due date is invalid.',
        });
      }

      newTask.dueDate = selectedDueDate;
    }


    const task = await Task.create(newTask);

    res.status(201).json(task);

  } catch (error) {
    console.log('Failed to create task:', error);

    res.status(500).json({
      message: 'Failed to create task',
    });
  }
});


// --------------------------------------------------
// COMPLETE A TASK
// --------------------------------------------------

router.patch('/complete/:id', async function (req, res) {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Task id is invalid.',
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }

    task.completed = true;
    task.completedAt = new Date();

    await task.save();

    res.json({
      message: 'Task completed.',
      task: task,
    });

  } catch (error) {
    console.log('Failed to complete the task:', error);

    res.status(500).json({
      message: 'Failed to complete the task',
    });
  }
});


// --------------------------------------------------
// REOPEN A TASK
// --------------------------------------------------

router.patch('/incomplete/:id', async function (req, res) {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Task id is invalid.',
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }

    task.completed = false;
    task.completedAt = null;

    await task.save();

    res.json({
      message: 'Task set to incomplete.',
      task: task,
    });

  } catch (error) {
    console.log('Failed to set the task to incomplete:', error);

    res.status(500).json({
      message: 'Failed to set the task to incomplete',
    });
  }
});


// --------------------------------------------------
// EDIT A TASK
// --------------------------------------------------

router.patch('/:id', async function (req, res) {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Task id is invalid.',
      });
    }

    const {
      title,
      description,
      dueDate,
    } = req.body;

    let taskTitle = '';
    let taskDescription = '';

    if (typeof title === 'string') {
      taskTitle = title.trim();
    }

    if (typeof description === 'string') {
      taskDescription = description.trim();
    }

    if (!taskTitle) {
      return res.status(400).json({
        message: 'Task title is required.',
      });
    }

    let taskDueDate = null;

    if (dueDate) {
      const selectedDueDate = new Date(dueDate);

      if (Number.isNaN(selectedDueDate.getTime())) {
        return res.status(400).json({
          message: 'Due date is invalid.',
        });
      }

      taskDueDate = selectedDueDate;
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }

    task.title = taskTitle;
    task.description = taskDescription;
    task.dueDate = taskDueDate;

    // IMPORTANT:
    // We deliberately DO NOT change task.createdBy here.
    // The original creator remains the original creator.

    await task.save();

    res.json(task);

  } catch (error) {
    console.log('Failed to update task:', error);

    res.status(500).json({
      message: 'Failed to update task',
    });
  }
});


// --------------------------------------------------
// DELETE A TASK
// --------------------------------------------------

router.delete('/:id', async function (req, res) {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Task id is invalid.',
      });
    }

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }

    res.json({
      message: 'Task deleted.',
      task: task,
    });

  } catch (error) {
    console.log('Failed to delete task:', error);

    res.status(500).json({
      message: 'Failed to delete task',
    });
  }
});


export default router;