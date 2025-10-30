import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { APP_CONFIG } from '../config/constants';

const AttendanceDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [stats, setStats] = useState({ 
    total: 0, 
    present: 0, 
    absent: 0, 
    totalEmployees: 0 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
    fetchStats();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [attendance, searchTerm, dateFilter]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_ENDPOINTS.ATTENDANCE);
      setAttendance(response.data.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.ATTENDANCE_STATS);
      setStats(response.data.data || { total: 0, present: 0, absent: 0, totalEmployees: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterAttendance = () => {
    let filtered = attendance;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeID?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(record => record.date === dateFilter);
    }

    setFilteredAttendance(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attendance record? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.ATTENDANCE_DELETE(id));
      
      // Refresh data
      fetchAttendance();
      fetchStats();
      
      // Show success message
      alert('Attendance record deleted successfully!');
    } catch (error) {
      console.error('Error deleting attendance:', error);
      alert('Failed to delete attendance record. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-5 fade-in">
        <h1 className="fw-bold text-white">
          <i className="fas fa-tachometer-alt me-2"></i>
          Attendance Dashboard
        </h1>
        <p className="text-white-50">Monitor and manage employee attendance records</p>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card stats-total">
            <h3>{stats.total}</h3>
            <p>Total Records</p>
            <i className="fas fa-database"></i>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card stats-present-card">
            <h3>{stats.present}</h3>
            <p>Present</p>
            <i className="fas fa-check-circle"></i>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card stats-absent-card">
            <h3>{stats.absent}</h3>
            <p>Absent</p>
            <i className="fas fa-times-circle"></i>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card stats-employees">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
            <i className="fas fa-users"></i>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section fade-in">
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label htmlFor="search" className="form-label fw-semibold">
              <i className="fas fa-search me-2"></i>
              Search Employees
            </label>
            <div className="input-group">
              <span className="input-group-text bg-transparent">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control search-box"
                id="search"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="dateFilter" className="form-label fw-semibold">
              <i className="fas fa-calendar me-2"></i>
              Filter by Date
            </label>
            <input
              type="date"
              className="form-control"
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
            >
              <i className="fas fa-times me-2"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-message fade-in">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Attendance Table */}
      <div className="attendance-card fade-in">
        <div className="card-header bg-transparent border-bottom-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="fas fa-list me-2"></i>
              Attendance Records
            </h5>
            <span className="badge bg-primary fs-6">
              {filteredAttendance.length} record(s) found
            </span>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredAttendance.length === 0 ? (
            <div className="text-center py-5 empty-state">
              <i className="fas fa-clipboard-list fa-4x mb-3"></i>
              <h5 className="text-muted">No attendance records found</h5>
              <p className="text-muted">
                {attendance.length === 0 
                  ? 'No attendance records available. Start by marking attendance.'
                  : 'No records match your search criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <i className="fas fa-user me-2 text-muted"></i>
                        <strong>{record.employeeName}</strong>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark fs-6">
                          {record.employeeID}
                        </span>
                      </td>
                      <td>
                        <i className="fas fa-calendar me-2 text-muted"></i>
                        {formatDate(record.date)}
                      </td>
                      <td>
                        <span 
                          className={`badge ${
                            record.status === 'Present' ? 'status-present' : 'status-absent'
                          }`}
                        >
                          <i 
                            className={`fas ${
                              record.status === 'Present' ? 'fa-check' : 'fa-times'
                            } me-1`}
                          ></i>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(record.id)}
                          title="Delete Record"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-4 text-white-50">
        <small>
          <i className="fas fa-university me-1"></i>
          {APP_CONFIG.INSTITUTION} - {APP_CONFIG.FACULTY}
        </small>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
