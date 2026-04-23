import { useContext } from 'react';
import { PostContext } from '../context/PostContext';

const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within PostProvider');
  return context;
};

export default usePosts;
