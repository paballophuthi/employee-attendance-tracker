// Application constants
export const APP_CONFIG = {
  NAME: 'Employee Attendance Tracker',
  VERSION: '1.0.0',
  INSTITUTION: 'Limkokwing University',
  FACULTY: 'Faculty of Information & Communication Technology'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'Present',
  ABSENT: 'Absent'
};

export const STATUS_OPTIONS = [
  { value: 'Present', label: 'Present', color: 'success' },
  { value: 'Absent', label: 'Absent', color: 'danger' }
];

export const DATE_FORMAT = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  INPUT: 'yyyy-MM-dd'
};
