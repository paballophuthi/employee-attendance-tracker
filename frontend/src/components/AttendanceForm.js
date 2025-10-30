import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { ATTENDANCE_STATUS, STATUS_OPTIONS } from '../config/constants';

const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: ATTENDANCE_STATUS.PRESENT
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(API_ENDPOINTS.ATTENDANCE, formData);
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Attendance recorded successfully!' 
      });
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: ATTENDANCE_STATUS.PRESENT
      });
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to record attendance. Please try again.';
      
      setMessage({ 
        type: 'danger', 
        text: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.employeeName.trim() && 
                     formData.employeeID.trim() && 
                     formData.date;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="attendance-form fade-in">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">
                <i className="fas fa-user-clock me-2"></i>
                Mark Employee Attendance
              </h2>
              <p className="text-muted">Record daily attendance for employees</p>
            </div>

            {message.text && (
              <div className={`alert alert-${message.type} alert-message fade-in`}>
                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="employeeName" className="form-label">
                    <i className="fas fa-user me-2"></i>
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeName"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="employeeID" className="form-label">
                    <i className="fas fa-id-card me-2"></i>
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeID"
                    name="employeeID"
                    value={formData.employeeID}
                    onChange={handleChange}
                    required
                    placeholder="Enter employee ID"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="date" className="form-label">
                    <i className="fas fa-calendar me-2"></i>
                    Date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label htmlFor="status" className="form-label">
                    <i className="fas fa-check-circle me-2"></i>
                    Attendance Status *
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  >
                    {STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Recording Attendance...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Record Attendance
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="fw-bold mb-2">
                <i className="fas fa-info-circle me-2 text-info"></i>
                Quick Tips:
              </h6>
              <ul className="list-unstyled mb-0 small">
                <li><i className="fas fa-check text-success me-2"></i>Ensure all fields are filled correctly</li>
                <li><i className="fas fa-check text-success me-2"></i>Employee ID should be unique for each employee</li>
                <li><i className="fas fa-check text-success me-2"></i>Attendance can only be recorded once per employee per day</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
