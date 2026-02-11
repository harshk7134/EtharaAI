import api from './axios';

export const markAttendance = (data) => api.post('/attendance', data);

export const getAttendance = (employeeId, params = {}) =>
  api.get(`/attendance/${employeeId}`, { params });
