import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await axios.post(API_BASE_URL, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Get tasks by status
  getTasksByStatus: async (completed) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/status/${completed}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      throw error;
    }
  }
};

export default taskService;
