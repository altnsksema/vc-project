import { useState, useEffect } from 'react';
import { storyService } from '../services/api';

export const useStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await storyService.getAllStories();
        setStories(data);
      } catch (err) {
        setError("Hikayeler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  return { stories, loading, error };
};