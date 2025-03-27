
import React, { useState, useEffect } from 'react';
import { Clock, Video, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchTimerProps {
  matchedUser: {
    id: string;
    name: string;
    image: string;
  };
  timeLimit: number; // in seconds
  onTimeUp: () => void;
  onStartCall: () => void;
  onCancel: () => void;
}

const MatchTimer: React.FC<MatchTimerProps> = ({
  matchedUser,
  timeLimit,
  onTimeUp,
  onStartCall,
  onCancel
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (!isTimerActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive, onTimeUp]);

  const progressPercentage = (timeLeft / timeLimit) * 100;

  const handleStartCall = () => {
    setIsTimerActive(false);
    onStartCall();
  };

  const handleCancel = () => {
    setIsTimerActive(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-3xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">It's a Match!</h2>
            <div className="flex items-center gap-2">
              <Clock size={18} className={cn(
                "text-primary",
                timeLeft < 30 && "text-red-500 animate-pulse"
              )} />
              <span className={cn(
                "font-mono font-bold",
                timeLeft < 30 && "text-red-500"
              )}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <img 
                src={matchedUser.image} 
                alt={matchedUser.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-center">{matchedUser.name}</h3>
            <p className="text-center text-muted-foreground mt-1">
              Start a call now or lose the match!
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleStartCall}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105 transform"
            >
              <Video size={20} />
              Start Video Call
            </button>
            
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all"
            >
              <X size={20} />
              Cancel Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchTimer;
