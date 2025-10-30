const validateAttendance = (req, res, next) => {
  const { employeeName, employeeID, date, status } = req.body;

  // Check required fields
  if (!employeeName || !employeeID || !date || !status) {
    return res.status(400).json({ 
      error: 'All fields are required: employeeName, employeeID, date, status' 
    });
  }

  // Validate employee name
  if (typeof employeeName !== 'string' || employeeName.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Employee name must be at least 2 characters long' 
    });
  }

  // Validate employee ID
  if (typeof employeeID !== 'string' || employeeID.trim().length < 1) {
    return res.status(400).json({ 
      error: 'Employee ID is required' 
    });
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ 
      error: 'Date must be in YYYY-MM-DD format' 
    });
  }

  // Validate status
  if (!['Present', 'Absent'].includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be either "Present" or "Absent"' 
    });
  }

  // Trim and sanitize inputs
  req.body.employeeName = employeeName.trim();
  req.body.employeeID = employeeID.trim();

  next();
};

module.exports = {
  validateAttendance
};
