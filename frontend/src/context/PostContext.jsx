import { createContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export const PostContext = createContext(null);

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // endpoint is passed in so the same fetcher handles public, my-posts, and admin-all.
  const fetchPosts = useCallback(async (filters = {}, endpoint = '/posts') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get(endpoint, { params: filters });
      setPosts(data.posts);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (postData) => {
    // Optimistic update: insert a placeholder with a temp ID so the UI responds
    // instantly without waiting for the server round-trip.
    const tempPost = {
      ...postData,
      _id: 'temp-' + Date.now(),
      author: { name: 'You' },
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [tempPost, ...prev]);

    try {
      const { data } = await axiosInstance.post('/posts', postData);
      // Replace the placeholder with the real document returned by the server.
      setPosts((prev) => prev.map((p) => (p._id === tempPost._id ? data : p)));
      return data;
    } catch (err) {
      // Roll back the placeholder so the list stays consistent with server state.
      setPosts((prev) => prev.filter((p) => p._id !== tempPost._id));
      throw err;
    }
  }, []);

  const updatePost = useCallback(async (id, postData) => {
    const { data } = await axiosInstance.put(`/posts/${id}`, postData);
    setPosts((prev) => prev.map((p) => (p._id === id ? data : p)));
    return data;
  }, []);

  const deletePost = useCallback(async (id) => {
    await axiosInstance.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  }, []);

  const updatePostStatus = useCallback(async (id, status) => {
    const { data } = await axiosInstance.patch(`/posts/${id}/status`, { status });
    setPosts((prev) => prev.map((p) => (p._id === id ? data : p)));
    return data;
  }, []);

  return (
    <PostContext.Provider value={{ posts, pagination, loading, error, fetchPosts, createPost, updatePost, deletePost, updatePostStatus }}>
      {children}
    </PostContext.Provider>
  );
}
