// services/studentService.js
import axios from 'axios';
import API_BASE_URL from './config';

export const studentService = {
  // Get all students with pagination and filters
  getStudents: async (organizationId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(
        `${API_BASE_URL}/organizations/${organizationId}/students/?${params}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch students');
    }
  },

  // Import students from an Excel file (POST request)
  importStudents: async (organizationId, file, batchId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('batch_id', batchId);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/students/import_students/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to import students',
      };
    }
  },

  // Bulk create students (POST request)
  bulkCreateStudents: async (organizationId, studentsData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/students/bulk_create/`,
        { students: studentsData }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create students',
      };
    }
  },

  // Create a single student (POST request)
  createStudent: async (organizationId, studentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/organizations/${organizationId}/students/`,
        studentData
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create student'
      };
    }
  },

  // Export student data (GET request, export in Excel format or others)
  exportData: async (organizationId, format = 'excel') => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/organizations/${organizationId}/students/export/?format=${format}`,
        { responseType: 'blob' }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to export student data',
      };
    }
  },

  // Get a specific student by ID
  getStudentById: async (studentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}students/${studentId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch student details'
      };
    }
  },

  // Update student details
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}students/${studentId}/`,
        studentData
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update student'
      };
    }
  },

  // Delete a student
  deleteStudent: async (studentId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}students/${studentId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete student'
      };
    }
  }
};
