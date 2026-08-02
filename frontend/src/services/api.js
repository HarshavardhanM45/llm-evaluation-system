import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Assuming FastAPI runs on 8000

export const evaluateAll = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/evaluate/all`, data);
    return response.data;
  } catch (error) {
    console.error("Error calling evaluate API:", error);
    throw error;
  }
};

export const evaluateBatch = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/evaluate/batch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error calling evaluate batch API:", error);
    throw error;
  }
};
