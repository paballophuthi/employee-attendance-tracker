const mysql = require('mysql2');
require('dotenv').config();

class Database {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'attendance_tracker',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      reconnect: true
    };
    
    this.pool = mysql.createPool(this.config);
    this.init();
  }

  init() {
    // Test connection and create database if needed
    this.getConnection((err, connection) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('\n💡 Please ensure:');
        console.log('1. MySQL server is running (XAMPP)');
        console.log('2. Database credentials are correct in .env file');
        console.log('3. Database "attendance_tracker" exists');
        return;
      }

      console.log('✅ Connected to MySQL server');

      // Create database if it doesn't exist
      const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${this.config.database}`;
      connection.query(createDbQuery, (err) => {
        if (err) {
          console.error('Error creating database:', err);
          return;
        }
        console.log(`✅ Database ${this.config.database} ensured`);

        // Switch to database
        connection.changeUser({ database: this.config.database }, (err) => {
          if (err) {
            console.error('Error switching database:', err);
            return;
          }

          // Create table
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS attendance (
              id INT AUTO_INCREMENT PRIMARY KEY,
              employeeName VARCHAR(255) NOT NULL,
              employeeID VARCHAR(100) NOT NULL,
              date DATE NOT NULL,
              status ENUM('Present', 'Absent') NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              INDEX idx_employee_id (employeeID),
              INDEX idx_date (date),
              INDEX idx_status (status),
              UNIQUE KEY unique_attendance (employeeID, date)
            )
          `;
          
          connection.query(createTableQuery, (err) => {
            if (err) {
              console.error('Error creating table:', err);
            } else {
              console.log('✅ Attendance table ensured');
            }
            connection.release();
          });
        });
      });
    });
  }

  getConnection(callback) {
    this.pool.getConnection(callback);
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      this.pool.end(() => {
        console.log('Database connection closed');
        resolve();
      });
    });
  }
}

module.exports = new Database();
