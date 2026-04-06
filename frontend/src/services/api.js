import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const storyService = {
  getAllStories: async () => {
    const response = await axios.get(`${BASE_URL}/stories/`);
    return response.data.kesfet;
  },
  getStoryDetail: async (id) => {
    const response = await axios.get(`${BASE_URL}/stories/${id}`);
    return response.data;
  }
};