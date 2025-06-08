import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiService = {
  post: async (path, data, token = true, img = false) => {
    try {
      let headers = {};
  
      if (img === true) {
        headers["Content-Type"] = "multipart/form-data";
      }
  
      if (token !== false) {
        const storedAuth = localStorage.getItem('authDoctor');

        if (!storedAuth) {
          throw new Error("User must be authenticated");
        }
        const parsedAuth = JSON.parse(storedAuth);
        if (!parsedAuth.token) {
          throw new Error("User must be authenticated");
        }
  
        headers.Authorization = `Bearer ${parsedAuth.token}`;
      }
  
      const response = await axios.post(`${API_BASE_URL}${path}`, data, { headers });
  
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || "Error creating data";
    }
  },
  

  put: async (path, id, data, token = true) => {
    try {
      let headers = {};
      if (token !== false) {
        const storedAuth = localStorage.getItem('authDoctor');
        if (!storedAuth) {
          throw new Error("User must be authenticated");
        }
        const parsedAuth = JSON.parse(storedAuth);
        if (!parsedAuth.token) {
          throw new Error("User must be authenticated");
        }
        
        headers.Authorization = `Bearer ${parsedAuth.token}`;
      }
      const response = await axios.put(`${API_BASE_URL}${path}/${id}`, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error.response?.data ||error || "Error updating data";
    }
  },

  delete: async (path, id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}${path}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Error deleting data";
    }
  },
};

export default apiService;
