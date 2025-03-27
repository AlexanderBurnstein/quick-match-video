
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After animation, go to the home page
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
      <div className="text-center max-w-md px-4 animate-fade-in">
        <div className="mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 animate-pulse-light" />
          </div>
          <div className="relative text-accent">
            <Heart size={48} className="mx-auto animate-pulse" />
          </div>
        </div>
        
        <h1 className={cn(
          "text-4xl font-bold mb-4 relative",
          "text-gradient"
        )}>
          Quick Match Video
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Find authentic connections through meaningful video calls with your matches
        </p>
        
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
