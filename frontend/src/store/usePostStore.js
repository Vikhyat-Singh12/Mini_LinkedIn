import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast'

export const usePostStore = create((set, get) => ({
  posts: [],
  userPost:[],
  isLoading: false,
  isCreatingPost: false,

  fetchPosts: async () => {
    set({isLoading: true});
    try {
      const response = await axios.get('/posts/');
      set({posts: response.data, isLoading: false});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
      set({isLoading: false});
    }
  },

  createPost: async (postData) => {
    set({isCreatingPost: true});
    try {
      const response = await axios.post('/posts/create', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({posts: [response.data, ...state.posts]}));
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
    finally {
      set({isCreatingPost: false});
    }
  },

  getUserPosts: async (userId) => {
    set({isLoading: true});
    try {
      const response = await axios.get(`/posts/user/${userId}`);
      set({userPost: response.data});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch user posts');
    }finally {
      set({isLoading: false});
    }
  },
}));