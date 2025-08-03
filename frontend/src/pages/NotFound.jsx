import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FloatingElement = ({ delay, size, color }) => (
    <div
      className={`absolute rounded-full opacity-20 animate-pulse`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    />
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <FloatingElement
            key={i}
            delay={i * 0.1}
            size={`${20 + Math.random() * 40}px`}
            color={['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)]}
          />
        ))}
      </div>

      <div
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 70%)',
          left: `${mousePosition.x - 10}%`,
          top: `${mousePosition.y - 10}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div
          className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
              404
            </h1>
            <h1 
              className="absolute top-0 left-0 text-8xl md:text-9xl font-black text-cyan-400 opacity-70 animate-ping"
              style={{ animationDuration: '2s' }}
            >
              404
            </h1>
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-bounce">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, even the best explorers get lost sometimes!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              to="/"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                🏠 Take Me Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-full hover:bg-cyan-400 hover:text-slate-900 transition-all duration-300 ease-out transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                ← Go Back
              </span>
            </button>
          </div>

          <div className="mt-12 text-gray-400 text-sm animate-pulse">
            <p>💡 Try moving your mouse around for a surprise!</p>
          </div>
        </div>
      </div>

      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default NotFound;