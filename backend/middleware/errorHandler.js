const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Attendance already recorded for this employee on the specified date'
    });
  }

  // MySQL connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      error: 'Database connection failed. Please try again later.'
    });
  }

  // Default error
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`
  });
};

module.exports = {
  errorHandler,
  notFound
};
