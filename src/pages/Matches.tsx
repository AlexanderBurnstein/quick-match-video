
import React, { useState } from 'react';
import { Phone, Video, Clock, Check, X, MessageCircle } from 'lucide-react';
import MatchTimer from '@/components/MatchTimer';
import VideoCall from '@/components/VideoCall';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Enhanced mock matches data with more details
const MOCK_MATCHES = [
  {
    id: '101',
    name: 'Olivia',
    age: 28,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    bio: 'Travel enthusiast and coffee lover. I enjoy hiking and photography on weekends.',
    location: 'San Francisco, CA',
    interests: ['Travel', 'Photography', 'Hiking', 'Coffee'],
    matchTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    status: 'waiting', // waiting, completed, expired, chatting
    lastMessage: 'Hey there! How are you doing today?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    canChat: false
  },
  {
    id: '102',
    name: 'Ethan',
    age: 32,
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    bio: 'Musician and foodie. I play guitar and love trying new restaurants.',
    location: 'Los Angeles, CA',
    interests: ['Music', 'Food', 'Concerts', 'Cooking'],
    matchTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'completed',
    lastMessage: 'It was great talking to you! Let\'s catch up again soon.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    canChat: true
  },
  {
    id: '103',
    name: 'Ava',
    age: 26,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    bio: 'Art lover and yoga instructor. Looking for someone to explore museums with.',
    location: 'New York, NY',
    interests: ['Art', 'Yoga', 'Museums', 'Meditation'],
    matchTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'chatting',
    lastMessage: 'Would you like to meet at the MoMA this weekend?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    canChat: true
  },
  {
    id: '104',
    name: 'Noah',
    age: 30,
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    bio: 'Tech entrepreneur and fitness enthusiast. I enjoy rock climbing and reading science fiction.',
    location: 'Seattle, WA',
    interests: ['Tech', 'Fitness', 'Climbing', 'Reading'],
    matchTime: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    status: 'expired',
    lastMessage: null,
    lastMessageTime: null,
    canChat: false
  }
];

const Matches = () => {
  const [matches, setMatches] = useState(MOCK_MATCHES);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'chatting'>('all');
  const [matchedUser, setMatchedUser] = useState<{
    id: string;
    name: string;
    image: string;
    bio?: string;
    interests?: string[];
    location?: string;
    age?: number;
  } | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [chatting, setChatting] = useState(false);
  const { toast } = useToast();

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return match.status === 'waiting';
    if (activeTab === 'completed') return match.status === 'completed';
    if (activeTab === 'chatting') return match.status === 'chatting';
    return true;
  });

  const handleStartTimer = (match: typeof MOCK_MATCHES[0]) => {
    setMatchedUser({
      id: match.id,
      name: match.name,
      image: match.image,
      bio: match.bio,
      interests: match.interests,
      location: match.location,
      age: match.age
    });
    setShowTimer(true);
  };

  const handleTimeUp = () => {
    toast({
      variant: "destructive",
      title: "Match expired!",
      description: `You didn't start a call with ${matchedUser?.name} in time.`,
    });
    setShowTimer(false);
    setMatchedUser(null);
    
    // Update match status
    if (matchedUser) {
      setMatches(matches.map(match => 
        match.id === matchedUser.id 
          ? { ...match, status: 'expired' } 
          : match
      ));
    }
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
    
    // Update match status
    if (matchedUser) {
      setMatches(matches.map(match => 
        match.id === matchedUser.id 
          ? { ...match, status: 'expired' } 
          : match
      ));
    }
  };

  const handleEndCall = () => {
    toast({
      title: "Call completed",
      description: `Your call with ${matchedUser?.name} has ended.`,
    });
    setInCall(false);
    
    // Update match status
    if (matchedUser) {
      setMatches(matches.map(match => 
        match.id === matchedUser.id 
          ? { ...match, status: 'completed' } 
          : match
      ));
    }
    
    setMatchedUser(null);
  };

  const handleRequestChat = (userId: string) => {
    setMatches(matches.map(match => 
      match.id === userId 
        ? { ...match, status: 'chatting', canChat: true } 
        : match
    ));
    
    toast({
      title: "Chat request accepted",
      description: "You can now continue chatting with this match!",
    });
  };

  const handleStartChat = (match: typeof MOCK_MATCHES[0]) => {
    setMatchedUser({
      id: match.id,
      name: match.name,
      image: match.image,
      bio: match.bio,
      interests: match.interests,
      location: match.location,
      age: match.age
    });
    setChatting(true);
  };

  return (
    <div className="min-h-screen pt-6 pb-24 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      
      {/* Tabs */}
      <div className="flex mb-6 overflow-x-auto pb-2 glass rounded-full p-1">
        {(['all', 'pending', 'chatting', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 px-4 text-sm font-medium rounded-full transition-all duration-200",
              activeTab === tab 
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-muted-foreground">
            <Clock size={48} className="mx-auto mb-2 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No matches found</h3>
          <p className="text-muted-foreground">
            {activeTab === 'pending' 
              ? "You don't have any pending matches." 
              : activeTab === 'completed'
                ? "You haven't completed any video calls yet."
                : activeTab === 'chatting'
                  ? "You aren't chatting with anyone yet."
                  : "Start swiping to find some matches!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <div 
              key={match.id} 
              className="glass rounded-xl p-4 transition-all hover:shadow-lg"
            >
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <img 
                    src={match.image} 
                    alt={match.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{match.name}{match.age && <span className="text-muted-foreground ml-1">{match.age}</span>}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(match.matchTime)}
                    </span>
                  </div>
                  
                  {match.location && (
                    <p className="text-xs text-muted-foreground mt-0.5">{match.location}</p>
                  )}
                  
                  <div className="flex items-center mt-1">
                    {match.status === 'waiting' && (
                      <span className="flex items-center text-xs text-amber-500">
                        <Clock size={14} className="mr-1" />
                        Waiting for call
                      </span>
                    )}
                    {match.status === 'completed' && (
                      <span className="flex items-center text-xs text-green-500">
                        <Check size={14} className="mr-1" />
                        Call completed
                      </span>
                    )}
                    {match.status === 'chatting' && (
                      <span className="flex items-center text-xs text-primary">
                        <MessageCircle size={14} className="mr-1" />
                        Chatting
                      </span>
                    )}
                    {match.status === 'expired' && (
                      <span className="flex items-center text-xs text-red-500">
                        <X size={14} className="mr-1" />
                        Match expired
                      </span>
                    )}
                  </div>
                  
                  {match.interests && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.interests.slice(0, 3).map((interest, idx) => (
                        <span key={idx} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {interest}
                        </span>
                      ))}
                      {match.interests.length > 3 && (
                        <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          +{match.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {match.lastMessage && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                      {match.lastMessage}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex justify-end">
                {match.status === 'waiting' && (
                  <button
                    onClick={() => handleStartTimer(match)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Video size={16} />
                    Start Call
                  </button>
                )}
                
                {match.status === 'completed' && !match.canChat && (
                  <button
                    onClick={() => handleStartTimer(match)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                  >
                    <Phone size={16} />
                    Call Again
                  </button>
                )}
                
                {(match.status === 'completed' || match.status === 'chatting') && match.canChat && (
                  <button
                    onClick={() => handleStartChat(match)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                  >
                    <MessageCircle size={16} />
                    Chat
                  </button>
                )}
              </div>
            </div>
          ))}
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
          onRequestChat={handleRequestChat}
        />
      )}
      
      {/* This would be replaced with an actual chat component */}
      {chatting && matchedUser && (
        <div className="fixed inset-0 bg-background z-50 animate-fade-in flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={matchedUser.image} 
                  alt={matchedUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{matchedUser.name}</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setChatting(false)}
              className="p-2 rounded-full hover:bg-secondary"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <div className="bg-secondary self-start max-w-[80%] rounded-lg p-3 rounded-tl-none">
                <p>Hey! It was great talking to you on our video call.</p>
              </div>
              
              <div className="bg-primary text-primary-foreground self-end max-w-[80%] rounded-lg p-3 rounded-tr-none">
                <p>Thanks! I enjoyed our conversation too. Would you like to meet up sometime?</p>
              </div>
              
              <div className="bg-secondary self-start max-w-[80%] rounded-lg p-3 rounded-tl-none">
                <p>I'd love that! Are you free this weekend?</p>
              </div>
              
              <div className="text-center text-xs text-muted-foreground my-4">
                Today, 2:30 PM
              </div>
              
              <div className="bg-primary text-primary-foreground self-end max-w-[80%] rounded-lg p-3 rounded-tr-none">
                <p>Yeah, I'm free on Saturday afternoon. How about coffee at that new place downtown?</p>
              </div>
              
              <div className="bg-secondary self-start max-w-[80%] rounded-lg p-3 rounded-tl-none">
                <p>Perfect! Let's meet at 2pm. I'm looking forward to it!</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 border-t">
            <form className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-background border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="p-2 rounded-full bg-primary text-primary-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
