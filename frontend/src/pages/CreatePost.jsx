import { useState, useRef, useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef();
  const textareaRef = useRef();
  
  const { createPost, isCreatingPost } = usePostStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const MAX_CHARS = 500;

  useEffect(() => {
    setIsVisible(true);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      return navigate('/login');
    }

    if (!text.trim() && !imageFile) {
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await createPost(formData);
      setText('');
      setImageFile(null);
      setImagePreview(null);
      navigate('/');
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setText(value);
      adjustTextareaHeight();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className={`text-center mb-6 sm:mb-8 transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Share Your Story
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            What's inspiring you today? Share it with the community!
          </p>
        </div>

        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
        }`} style={{ transitionDelay: '200ms' }}>
          
          <div className="p-4 sm:p-6 border-b border-gray-100/50">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base sm:text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{user?.name || 'User'}</h3>
                <p className="text-xs sm:text-sm text-gray-500">Sharing publicly</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="w-full resize-none border-none outline-none text-base sm:text-lg placeholder-gray-400 bg-transparent min-h-[100px] sm:min-h-[120px] leading-relaxed"
                placeholder="What's on your mind? Share your thoughts, experiences, or ask a question..."
                value={text}
                onChange={handleTextChange}
                onInput={adjustTextareaHeight}
                style={{ maxHeight: '300px' }}
              />
              
              <div className={`absolute bottom-2 right-2 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {charCount}/{MAX_CHARS}
              </div>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                isDragOver
                  ? 'border-purple-400 bg-purple-50/50 scale-102'
                  : imagePreview
                  ? 'border-green-400 bg-green-50/30'
                  : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/20'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-60 sm:max-h-80 object-contain rounded-lg sm:rounded-xl shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg text-sm sm:text-base"
                  >
                    ×
                  </button>
                  <div className="absolute inset-0 bg-black/5 rounded-lg sm:rounded-xl" />
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Add an image</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">Drag and drop an image here, or click to browse</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                  >
                    Choose Image
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Upload image"
              />
            </div>

            <div className="pt-4 border-t border-gray-100/50 space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Photo</span>
                  <span className="sm:hidden">📷</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1z" />
                  </svg>
                  <span className="hidden sm:inline">Poll</span>
                  <span className="sm:hidden">📊</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200 order-2 sm:order-1"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isCreatingPost || (!text.trim() && !imageFile)}
                  className={`relative w-full sm:w-auto px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 transform order-1 sm:order-2 ${
                    isCreatingPost || (!text.trim() && !imageFile)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {isCreatingPost ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="hidden sm:inline">Publishing...</span>
                      <span className="sm:hidden">Publishing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="hidden sm:inline">Publish Post</span>
                      <span className="sm:hidden">Publish</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className={`mt-6 sm:mt-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200/30 transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`} style={{ transitionDelay: '400ms' }}>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <span className="text-base sm:text-lg">💡</span>
            Tips for great posts
          </h3>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
            <li>• Share your authentic thoughts and experiences</li>
            <li>• Add images to make your posts more engaging</li>
            <li>• Ask questions to start conversations</li>
            <li>• Keep it concise but meaningful</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;