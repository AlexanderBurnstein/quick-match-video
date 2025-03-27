
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Phone, Video as VideoIcon, VideoOff, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCallProps {
  matchedUser: {
    id: string;
    name: string;
    image: string;
  };
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ matchedUser, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{sender: 'me' | 'them', text: string}[]>([]);

  // Format call time as MM:SS
  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, { sender: 'me', text: message }]);
    setMessage('');

    // Simulate response after a short delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'them', 
          text: "Thanks for the message! I'm enjoying our conversation." 
        }
      ]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 animate-fade-in flex">
      {/* Main call view */}
      <div className="relative w-full h-full">
        {/* "Their" video (fullscreen) */}
        <div className="absolute inset-0 bg-gray-900">
          {!isVideoOff ? (
            <img 
              src={matchedUser.image}
              alt={`${matchedUser.name}'s video`}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-700 mb-3">
                  <img 
                    src={matchedUser.image}
                    alt={matchedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-xl font-medium">{matchedUser.name}</p>
                <p className="text-gray-400">Video paused</p>
              </div>
            </div>
          )}
        </div>

        {/* Your video (picture-in-picture) */}
        <div className="absolute right-4 top-4 w-32 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg z-10">
          <div className={cn(
            "w-full h-full",
            isVideoOff ? "bg-gray-800 flex items-center justify-center" : "bg-gray-900"
          )}>
            {!isVideoOff ? (
              // Placeholder for your own camera
              <div className="w-full h-full bg-gradient-to-br from-purple-800 to-blue-600 flex items-center justify-center">
                <span className="text-white">Your camera</span>
              </div>
            ) : (
              <VideoOff size={24} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* Call info bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="pulse-dot h-2 w-2 rounded-full bg-red-500 animate-pulse-light"></span>
            <span className="text-white font-mono">{formatCallTime(callTime)}</span>
          </div>
          <div className="text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
            {matchedUser.name}
          </div>
        </div>

        {/* Call controls */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-4 z-10">
          <div className="glass py-4 px-6 rounded-full flex items-center gap-6">
            <button 
              onClick={toggleMute}
              className={cn(
                "p-3 rounded-full transition-colors hover:bg-gray-100/10",
                isMuted ? "bg-red-500/80 text-white" : "bg-white/10 text-white"
              )}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            <button 
              onClick={toggleVideo}
              className={cn(
                "p-3 rounded-full transition-colors hover:bg-gray-100/10",
                isVideoOff ? "bg-red-500/80 text-white" : "bg-white/10 text-white"
              )}
            >
              {isVideoOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
            </button>

            <button 
              onClick={toggleChat}
              className={cn(
                "p-3 rounded-full transition-colors hover:bg-gray-100/10",
                isChatOpen ? "bg-primary text-white" : "bg-white/10 text-white"
              )}
            >
              <MessageCircle size={24} />
            </button>

            <button 
              onClick={onEndCall}
              className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      {isChatOpen && (
        <div className="glass w-full max-w-xs border-l border-white/10 animate-slide-in-right">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-semibold">Chat with {matchedUser.name}</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "max-w-[80%] p-3 rounded-lg",
                        msg.sender === 'me' 
                          ? "bg-primary text-white ml-auto rounded-br-none" 
                          : "bg-white/10 text-white mr-auto rounded-bl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-white/10">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit"
                  className="p-2 rounded-full bg-primary text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
