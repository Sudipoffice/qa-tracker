import api from '../api/axios';

export const getTasks = (params) => api.get('/tasks', { params });
export const getTaskByProject = (projectId) => api.get(`/tasks/${projectId}`);
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
