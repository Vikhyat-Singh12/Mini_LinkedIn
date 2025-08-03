import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePostStore } from '../store/usePostStore';

const Profile = () => {
  const { id } = useParams();
  const { profileUser: user, getProfile, user: currentUser } = useAuthStore();
  const { userPost: posts, getUserPosts } = usePostStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [visiblePosts, setVisiblePosts] = useState(new Set());
  const observerRef = useRef();

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setIsLoading(true);
      try {
        await getProfile(id);
        await getUserPosts(id);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [id]);

  useEffect(() => {
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
        className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-700 ease-out transform ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}
        style={{ 
          transitionDelay: `${index * 100}ms`,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)'
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <time className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
              {formatTimeAgo(post.createdAt)}
            </time>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          <p className="text-gray-800 leading-relaxed mb-4 text-lg">
            {post.text}
          </p>

          {post.image && (
            <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-500 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium">Like</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">Comment</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const ProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="relative bg-gradient-to-br from-purple-600 to-cyan-600 h-48 rounded-2xl mb-8">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 bg-gray-300 rounded-full border-8 border-white" />
        </div>
      </div>
      <div className="text-center pt-20 pb-8">
        <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
      </div>
    </div>
  );

  const EmptyPosts = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
      <p className="text-gray-600 mb-6">
        {currentUser?._id === id 
          ? "Share your first thought with the community!"
          : `${user?.name || 'This user'} hasn't posted anything yet.`
        }
      </p>
      {currentUser?._id === id && (
        <Link
          to="/create-post"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          ✨ Create Your First Post
        </Link>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {user && (
          <>
            <div className="relative mb-12">
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 h-48 md:h-64 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-4 left-1/3 w-8 h-8 bg-white/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
              </div>

              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full border-8 border-white shadow-2xl flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white shadow-lg" />
                </div>
              </div>
            </div>

            <div className="text-center pt-20 pb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {user.name}
              </h1>
              <p className="text-gray-600 text-lg mb-4">{user.email}</p>
              <p className="text-gray-700 font-medium">Software Engineer</p>
              
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1.2K</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">892</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>

              {currentUser?._id === id ? (
                <div className="flex justify-center gap-4 mt-6">
                  <Link
                    to="/create-post"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    ✏️ Create Post
                  </Link>
                  <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-400 hover:text-purple-600 transition-all duration-300">
                    ⚙️ Edit Profile
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-4 mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    👋 Follow
                  </button>
                  <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-400 hover:text-purple-600 transition-all duration-300">
                    💬 Message
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-gray-200/50">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'posts'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  📝 Posts
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'about'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  👤 About
                </button>
              </div>
            </div>

            {activeTab === 'posts' ? (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <EmptyPosts />
                ) : (
                  posts.map((post, index) => (
                    <PostCard key={post._id} post={post} index={index} />
                  ))
                )}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  About {user.name}
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> Software Engineer</p>
                  <p><strong>Joined:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                  <p><strong>Bio:</strong> {user.bio || 'No bio provided'}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;