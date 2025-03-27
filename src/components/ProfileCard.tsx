
import React, { useState } from 'react';
import { Heart, X, MessageCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    bio: string;
    distance: string;
    images: string[];
    interests: string[];
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const nextImage = () => {
    if (currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startX === 0) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    handleSwipeEnd();
  };

  const handleMouseUp = () => {
    handleSwipeEnd();
    setStartX(0);
  };

  const handleSwipeEnd = () => {
    const threshold = 100;
    
    if (offsetX > threshold) {
      setSwipeDirection('right');
      setTimeout(() => {
        onSwipeRight();
        setSwipeDirection(null);
        setOffsetX(0);
      }, 500);
    } else if (offsetX < -threshold) {
      setSwipeDirection('left');
      setTimeout(() => {
        onSwipeLeft();
        setSwipeDirection(null);
        setOffsetX(0);
      }, 500);
    } else {
      setOffsetX(0);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwipeDirection('right');
    setTimeout(() => {
      onSwipeRight();
      setSwipeDirection(null);
    }, 500);
  };

  const handlePass = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwipeDirection('left');
    setTimeout(() => {
      onSwipeLeft();
      setSwipeDirection(null);
    }, 500);
  };

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const cardRotation = offsetX * 0.05;
  const cardOpacity = Math.max(1 - Math.abs(offsetX) / 400, 0.5);

  return (
    <div 
      className={cn(
        "card-container w-full max-w-md mx-auto relative h-[calc(100vh-8rem)]",
        swipeDirection === 'left' && 'animate-card-swipe-left',
        swipeDirection === 'right' && 'animate-card-swipe-right'
      )}
    >
      <div
        className="profile-card glass rounded-3xl overflow-hidden shadow-lg h-full"
        style={{ 
          transform: `rotate(${cardRotation}deg) translateX(${offsetX * 0.2}px)`,
          opacity: cardOpacity,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative h-full w-full">
          {/* Image pager indicators */}
          <div className="absolute top-4 left-0 right-0 z-10 flex justify-center space-x-1">
            {profile.images.map((_, index) => (
              <div 
                key={index} 
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  currentImageIndex === index 
                    ? "w-6 bg-white" 
                    : "w-4 bg-white/50"
                )}
              />
            ))}
          </div>

          {/* Main image - now full height */}
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <img
              src={profile.images[currentImageIndex]}
              alt={`${profile.name}'s photo`}
              className="h-full w-full object-cover transition-transform duration-500 ease-out"
              style={{ 
                transform: offsetX ? `scale(${1 + Math.abs(offsetX) / 5000})` : 'scale(1)'
              }}
            />
            
            {/* Left/right area for navigation */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full" onClick={prevImage} />
              <div className="w-1/2 h-full" onClick={nextImage} />
            </div>
          </div>

          {/* Overlay gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Profile info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.name}, {profile.age}
                </h2>
                <p className="text-sm opacity-90">{profile.distance}</p>
              </div>
              <button
                onClick={toggleDetails}
                className="rounded-full p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
              >
                <Info size={20} />
              </button>
            </div>
          </div>

          {/* Overlaid Action buttons */}
          <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-12 px-6">
            <button 
              onClick={handlePass}
              className="p-4 rounded-full bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <X size={32} className="text-red-500" />
            </button>
            
            <button 
              onClick={handleLike}
              className="p-4 rounded-full bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <Heart size={32} className="text-primary" />
            </button>
          </div>

          {/* Expanded details panel */}
          {showDetails && (
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm p-6 animate-fade-in"
              onClick={toggleDetails}
            >
              <div className="h-full flex flex-col text-white overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2">About {profile.name}</h3>
                <p className="mb-4">{profile.bio}</p>
                
                <h3 className="text-lg font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.interests.map((interest, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-full bg-white/20 text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <button 
                    className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
                    onClick={toggleDetails}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
