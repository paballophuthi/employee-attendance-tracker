const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { validateAttendance } = require('../middleware/validation');

// GET all attendance records
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const attendance = await Attendance.getAll(page, limit);
    res.json({
      success: true,
      data: attendance,
      pagination: {
        page,
        limit,
        total: attendance.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST new attendance record
router.post('/', validateAttendance, async (req, res, next) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;

    // Check if attendance already exists for this employee on this date
    const exists = await Attendance.exists(employeeID, date);
    if (exists) {
      return res.status(409).json({
        success: false,
        error: 'Attendance already recorded for this employee on the specified date'
      });
    }

    const id = await Attendance.create({ employeeName, employeeID, date, status });
    
    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: { id, employeeName, employeeID, date, status }
    });
  } catch (error) {
    next(error);
  }
});

// GET attendance by date
router.get('/date/:date', async (req, res, next) => {
  try {
    const { date } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const attendance = await Attendance.getByDate(date, page, limit);
    res.json({
      success: true,
      data: attendance,
      pagination: {
        page,
        limit,
        total: attendance.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// SEARCH attendance records
router.get('/search/:query', async (req, res, next) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    const attendance = await Attendance.search(query.trim(), page, limit);
    res.json({
      success: true,
      data: attendance,
      pagination: {
        page,
        limit,
        total: attendance.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE attendance record
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid attendance ID is required'
      });
    }

    const deleted = await Attendance.delete(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const stats = await Attendance.getStats();
    res.json({
      success: true,
      data: stats[0] || { total: 0, present: 0, absent: 0, totalEmployees: 0 }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
