const db = require('../config/database');

class Attendance {
  // Get all attendance records with pagination
  static async getAll(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM attendance 
      ORDER BY date DESC, created_at DESC 
      LIMIT ? OFFSET ?
    `;
    return await db.query(query, [limit, offset]);
  }

  // Create new attendance record
  static async create(attendanceData) {
    const { employeeName, employeeID, date, status } = attendanceData;
    
    const query = `
      INSERT INTO attendance (employeeName, employeeID, date, status) 
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await db.query(query, [employeeName, employeeID, date, status]);
    return result.insertId;
  }

  // Get attendance by employee ID
  static async getByEmployeeID(employeeID, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM attendance 
      WHERE employeeID = ? 
      ORDER BY date DESC 
      LIMIT ? OFFSET ?
    `;
    return await db.query(query, [employeeID, limit, offset]);
  }

  // Get attendance by date
  static async getByDate(date, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM attendance 
      WHERE date = ? 
      ORDER BY employeeName 
      LIMIT ? OFFSET ?
    `;
    return await db.query(query, [date, limit, offset]);
  }

  // Search attendance records
  static async search(queryText, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM attendance 
      WHERE employeeName LIKE ? OR employeeID LIKE ? 
      ORDER BY date DESC 
      LIMIT ? OFFSET ?
    `;
    const searchTerm = `%${queryText}%`;
    return await db.query(query, [searchTerm, searchTerm, limit, offset]);
  }

  // Delete attendance record
  static async delete(id) {
    const query = 'DELETE FROM attendance WHERE id = ?';
    const result = await db.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Get statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent,
        COUNT(DISTINCT employeeID) as totalEmployees
      FROM attendance
    `;
    return await db.query(query);
  }

  // Check if attendance already exists for employee on date
  static async exists(employeeID, date) {
    const query = 'SELECT id FROM attendance WHERE employeeID = ? AND date = ?';
    const results = await db.query(query, [employeeID, date]);
    return results.length > 0;
  }
}

module.exports = Attendance;
