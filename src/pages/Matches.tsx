
import React, { useState } from 'react';
import { Phone, Video, Clock, Check, X } from 'lucide-react';
import MatchTimer from '@/components/MatchTimer';
import VideoCall from '@/components/VideoCall';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock matches data
const MOCK_MATCHES = [
  {
    id: '101',
    name: 'Olivia',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    matchTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    status: 'waiting', // waiting, completed, expired
    lastMessage: 'Hey there! How are you doing today?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  },
  {
    id: '102',
    name: 'Ethan',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    matchTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'completed',
    lastMessage: 'It was great talking to you! Let\'s catch up again soon.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: '103',
    name: 'Ava',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    matchTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'completed',
    lastMessage: null,
    lastMessageTime: null
  },
  {
    id: '104',
    name: 'Noah',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    matchTime: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    status: 'expired',
    lastMessage: null,
    lastMessageTime: null
  }
];

const Matches = () => {
  const [matches, setMatches] = useState(MOCK_MATCHES);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [matchedUser, setMatchedUser] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [inCall, setInCall] = useState(false);
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
    return true;
  });

  const handleStartTimer = (match: typeof MOCK_MATCHES[0]) => {
    setMatchedUser({
      id: match.id,
      name: match.name,
      image: match.image
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

  return (
    <div className="min-h-screen pt-6 pb-24 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      
      {/* Tabs */}
      <div className="flex mb-6 overflow-x-auto pb-2 glass rounded-full p-1">
        {(['all', 'pending', 'completed'] as const).map((tab) => (
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
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img 
                    src={match.image} 
                    alt={match.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{match.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(match.matchTime)}
                    </span>
                  </div>
                  
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
                    {match.status === 'expired' && (
                      <span className="flex items-center text-xs text-red-500">
                        <X size={14} className="mr-1" />
                        Match expired
                      </span>
                    )}
                  </div>
                  
                  {match.lastMessage && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                      {match.lastMessage}
                    </p>
                  )}
                </div>
              </div>
              
              {match.status === 'waiting' && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleStartTimer(match)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Video size={16} />
                    Start Call
                  </button>
                </div>
              )}
              
              {match.status === 'completed' && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleStartTimer(match)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                  >
                    <Phone size={16} />
                    Call Again
                  </button>
                </div>
              )}
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
        />
      )}
    </div>
  );
};

export default Matches;
