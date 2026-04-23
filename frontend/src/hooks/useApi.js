import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, params = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance({ method, url, data, params });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};

export default useApi;
