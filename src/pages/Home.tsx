
import React, { useState, useEffect } from 'react';
import ProfileCard from '@/components/ProfileCard';
import MatchTimer from '@/components/MatchTimer';
import VideoCall from '@/components/VideoCall';
import { useToast } from '@/hooks/use-toast';

// Mock profiles data
const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Sophia',
    age: 28,
    bio: 'Adventurous soul who loves hiking, photography, and trying new cuisines. Looking for someone who appreciates the beauty in everyday moments.',
    distance: '3 miles away',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    interests: ['Hiking', 'Photography', 'Cooking', 'Travel', 'Yoga']
  },
  {
    id: '2',
    name: 'James',
    age: 30,
    bio: 'Tech enthusiast and weekend musician. Coffee addict who enjoys deep conversations and spontaneous road trips.',
    distance: '5 miles away',
    images: [
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    interests: ['Music', 'Technology', 'Coffee', 'Road Trips', 'Reading']
  },
  {
    id: '3',
    name: 'Emma',
    age: 26,
    bio: 'Art gallery curator with a passion for indie films and vintage fashion. Looking for someone to explore museums and enjoy quiet evenings with.',
    distance: '7 miles away',
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    interests: ['Art', 'Film', 'Fashion', 'Reading', 'Museums']
  },
  {
    id: '4',
    name: 'Michael',
    age: 32,
    bio: 'Former athlete turned fitness coach. Loves outdoor activities, good food, and meaningful conversations. Seeking genuine connections.',
    distance: '2 miles away',
    images: [
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04'
    ],
    interests: ['Fitness', 'Nutrition', 'Sports', 'Cooking', 'Hiking']
  }
];

const Home = () => {
  const [currentProfiles, setCurrentProfiles] = useState([...MOCK_PROFILES]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedUser, setMatchedUser] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [inCall, setInCall] = useState(false);
  const { toast } = useToast();

  // Reset when all profiles are swiped
  useEffect(() => {
    if (currentProfiles.length === 0) {
      setTimeout(() => {
        toast({
          title: "That's all for now!",
          description: "Check back later for more matches.",
        });
        setCurrentProfiles([...MOCK_PROFILES]);
        setCurrentIndex(0);
      }, 500);
    }
  }, [currentProfiles, toast]);

  const getCurrentProfile = () => {
    return currentProfiles[currentIndex];
  };

  const handleSwipeLeft = () => {
    if (currentIndex < currentProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentProfiles([]);
    }
  };

  const handleSwipeRight = () => {
    // 50% chance to match
    const didMatch = Math.random() > 0.5;
    
    if (didMatch) {
      const currentProfile = getCurrentProfile();
      setMatchedUser({
        id: currentProfile.id,
        name: currentProfile.name,
        image: currentProfile.images[0]
      });
      setShowTimer(true);
    }
    
    if (currentIndex < currentProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentProfiles([]);
    }
  };

  const handleTimeUp = () => {
    toast({
      variant: "destructive",
      title: "Match expired!",
      description: `You didn't start a call with ${matchedUser?.name} in time.`,
    });
    setShowTimer(false);
    setMatchedUser(null);
  };

  const handleStartCall = () => {
    setShowTimer(false);
    setInCall(true);
  };

  const handleCancelMatch = () => {
    toast({
      title: "Match canceled",
      description: "You've canceled the match.",
    });
    setShowTimer(false);
    setMatchedUser(null);
  };

  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: `Your call with ${matchedUser?.name} has ended.`,
    });
    setInCall(false);
    setMatchedUser(null);
  };

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30">
      {currentProfiles.length > 0 ? (
        <ProfileCard
          profile={getCurrentProfile()}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      ) : (
        <div className="glass p-8 rounded-3xl text-center animate-pulse-light">
          <h3 className="text-xl font-semibold mb-2">Finding new matches...</h3>
          <p className="text-muted-foreground">Check back soon for more profiles</p>
        </div>
      )}
      
      {showTimer && matchedUser && (
        <MatchTimer
          matchedUser={matchedUser}
          timeLimit={300} // 5 minutes in seconds
          onTimeUp={handleTimeUp}
          onStartCall={handleStartCall}
          onCancel={handleCancelMatch}
        />
      )}
      
      {inCall && matchedUser && (
        <VideoCall
          matchedUser={matchedUser}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
};

export default Home;
