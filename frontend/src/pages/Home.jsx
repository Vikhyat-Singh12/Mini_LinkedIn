// src/pages/Home.jsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { usePostStore } from '../store/usePostStore';

const Home = () => {
  const { posts, fetchPosts } = usePostStore();
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(new Set());
  const observerRef = useRef();

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      await fetchPosts();
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisiblePosts(prev => new Set([...prev, entry.target.dataset.postId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return postDate.toLocaleDateString();
  };

  const PostCard = ({ post, index }) => {
    const cardRef = useRef();
    const isVisible = visiblePosts.has(post._id);

    useEffect(() => {
      if (cardRef.current && observerRef.current) {
        observerRef.current.observe(cardRef.current);
      }
    }, []);

    return (
      <article
        ref={cardRef}
        data-post-id={post._id}
        className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-700 ease-out transform ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}
        style={{ 
          transitionDelay: `${index * 100}ms`,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to={`/profile/${post.user._id}`}
              className="flex items-center gap-3 group/profile hover:bg-gray-50/50 rounded-lg p-2 -m-2 transition-all duration-200"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg group-hover/profile:shadow-xl transition-shadow duration-300">
                  <span className="text-white font-bold text-lg">
                    {post.user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover/profile:text-purple-600 transition-colors duration-200">
                  {post.user.name}
                </h3>
                <p className="text-sm text-gray-500">Software Engineer</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <time className="text-sm text-gray-500 font-medium">
                {formatTimeAgo(post.createdAt)}
              </time>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-800 leading-relaxed text-lg">
              {post.text}
            </p>
          </div>

          {post.image && (
            <div className="mb-4 -mx-6">
              <div className="relative overflow-hidden bg-gray-100 rounded-none group-hover:rounded-xl transition-all duration-500">
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  style={{ maxHeight: 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-500 transition-all duration-200 group/like">
                <svg className="w-5 h-5 group-hover/like:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">Like</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-all duration-200 group/comment">
                <svg className="w-5 h-5 group-hover/comment:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">Comment</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-500 transition-all duration-200 group/share">
                <svg className="w-5 h-5 group-hover/share:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/50 rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
          </div>
          <div className="h-48 bg-gray-300 rounded-xl" />
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet!</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Be the first to share something amazing with the community. Your story matters!
      </p>
      <Link
        to="/create-post"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        ✨ Create Your First Post
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Community Feed
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover amazing stories, insights, and updates from our vibrant community
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>

      <Link
        to="/create-post"
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center transition-all duration-300 hover:scale-110 group z-40"
      >
        <svg className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
};

export default Home;