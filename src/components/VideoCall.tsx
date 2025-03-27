import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, Video as VideoIcon, VideoOff, MessageCircle, X, Heart, ThumbsUp, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCallProps {
  matchedUser: {
    id: string;
    name: string;
    image: string;
    bio?: string;
    interests?: string[];
    location?: string;
    age?: number;
    job?: string;
    height?: string;
    astroSign?: string;
    school?: string;
  };
  onEndCall: () => void;
  onRequestChat?: (userId: string) => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: Date;
  reactions: Array<{
    type: 'heart' | 'like';
    by: 'me' | 'them';
  }>;
  replyTo?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ matchedUser, onEndCall, onRequestChat }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [requestedChat, setRequestedChat] = useState(false);
  const [chatAccepted, setChatAccepted] = useState(false);
  const [chatRequestReceived, setChatRequestReceived] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);

    const chatRequestTimer = setTimeout(() => {
      if (callEnded && !requestedChat) {
        setChatRequestReceived(true);
      }
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(chatRequestTimer);
    };
  }, [callEnded, requestedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleUserInfo = () => setShowUserInfo(!showUserInfo);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: message,
      timestamp: new Date(),
      reactions: [],
      replyTo: replyingTo || undefined
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    setReplyingTo(null);

    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'them',
        text: "Thanks for the message! I'm enjoying our conversation.",
        timestamp: new Date(),
        reactions: []
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleEndCallInternal = () => {
    setCallEnded(true);
    onEndCall();
  };

  const handleRequestChat = () => {
    setRequestedChat(true);
    
    setTimeout(() => {
      setChatAccepted(true);
      if (onRequestChat) onRequestChat(matchedUser.id);
    }, 2000);
  };

  const handleAcceptChatRequest = () => {
    setChatRequestReceived(false);
    setChatAccepted(true);
  };

  const handleRejectChatRequest = () => {
    setChatRequestReceived(false);
  };

  const handleAddReaction = (messageId: string, reactionType: 'heart' | 'like') => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const existingReactionIndex = msg.reactions.findIndex(
            r => r.type === reactionType && r.by === 'me'
          );
          
          if (existingReactionIndex !== -1) {
            const updatedReactions = [...msg.reactions];
            updatedReactions.splice(existingReactionIndex, 1);
            return { ...msg, reactions: updatedReactions };
          }
          
          return {
            ...msg,
            reactions: [...msg.reactions, { type: reactionType, by: 'me' }]
          };
        }
        return msg;
      })
    );
  };

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const getMessageById = (id: string) => {
    return messages.find(msg => msg.id === id);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 animate-fade-in flex">
      <div className="relative w-full h-full">
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

        <div className="absolute right-4 top-4 w-32 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg z-10">
          <div className={cn(
            "w-full h-full",
            isVideoOff ? "bg-gray-800 flex items-center justify-center" : "bg-gray-900"
          )}>
            {!isVideoOff ? (
              <div className="w-full h-full bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center">
                <span className="text-white">Your camera</span>
              </div>
            ) : (
              <VideoOff size={24} className="text-gray-400" />
            )}
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="pulse-dot h-2 w-2 rounded-full bg-red-500 animate-pulse-light"></span>
            <span className="text-white font-mono">{formatCallTime(callTime)}</span>
          </div>
          <div 
            className="text-white bg-black/30 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer"
            onClick={toggleUserInfo}
          >
            {matchedUser.name}
            {matchedUser.age && <span>• {matchedUser.age}</span>}
          </div>
        </div>

        {showUserInfo && (
          <div className="absolute top-16 right-4 glass p-4 rounded-xl z-20 max-w-xs animate-fade-in">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{matchedUser.name}, {matchedUser.age || '??'}</h3>
              <button onClick={toggleUserInfo}><X size={18} /></button>
            </div>
            {matchedUser.location && (
              <p className="text-sm text-gray-200 mb-2">📍 {matchedUser.location}</p>
            )}
            {matchedUser.job && (
              <p className="text-sm text-gray-200 mb-2">💼 {matchedUser.job}</p>
            )}
            {matchedUser.height && matchedUser.astroSign && (
              <p className="text-sm text-gray-200 mb-2">📏 {matchedUser.height} • ✨ {matchedUser.astroSign}</p>
            )}
            {matchedUser.school && (
              <p className="text-sm text-gray-200 mb-2">🎓 {matchedUser.school}</p>
            )}
            {matchedUser.bio && (
              <p className="text-sm mb-3">{matchedUser.bio}</p>
            )}
            {matchedUser.interests && matchedUser.interests.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-300 mb-1">Interests</p>
                <div className="flex flex-wrap gap-1">
                  {matchedUser.interests.map((interest, idx) => (
                    <span key={idx} className="text-xs bg-primary/20 text-white px-2 py-1 rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isChatOpen && (
          <div className="absolute bottom-28 right-4 w-full max-w-xs h-3/5 flex flex-col z-20 animate-slide-in-right">
            <div className="flex-1 p-4 overflow-y-auto backdrop-blur-md bg-black/40 border border-white/10 rounded-t-xl">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="relative group">
                      {msg.replyTo && (
                        <div className="ml-6 mb-1 p-1.5 bg-gray-800/60 text-gray-300 text-xs rounded border-l-2 border-gray-500 max-w-[90%]">
                          <p className="truncate">
                            {getMessageById(msg.replyTo)?.text || "Message not found"}
                          </p>
                        </div>
                      )}
                      
                      <div 
                        className={cn(
                          "max-w-[80%] p-2.5 rounded-lg backdrop-blur-md",
                          msg.sender === 'me' 
                            ? "bg-red-500/80 text-white ml-auto rounded-br-none" 
                            : "bg-white/10 text-white mr-auto rounded-bl-none"
                        )}
                      >
                        {msg.text}
                        
                        {msg.reactions.length > 0 && (
                          <div className="flex -space-x-1 mt-1">
                            {msg.reactions.map((reaction, idx) => (
                              <div 
                                key={`${reaction.type}-${idx}`}
                                className={cn(
                                  "flex items-center justify-center rounded-full h-5 w-5",
                                  reaction.type === 'heart' ? "bg-red-500" : "bg-blue-500"
                                )}
                              >
                                {reaction.type === 'heart' ? (
                                  <Heart size={12} className="text-white" />
                                ) : (
                                  <ThumbsUp size={12} className="text-white" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity absolute",
                        msg.sender === 'me' ? "left-0 -translate-x-full" : "right-0 translate-x-full",
                        "top-1/2 -translate-y-1/2 flex flex-col gap-1"
                      )}>
                        <button 
                          onClick={() => handleAddReaction(msg.id, 'heart')}
                          className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-600"
                        >
                          <Heart size={14} />
                        </button>
                        <button 
                          onClick={() => handleAddReaction(msg.id, 'like')}
                          className="p-1.5 rounded-full bg-blue-500/80 text-white hover:bg-blue-600"
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button 
                          onClick={() => handleReply(msg.id)}
                          className="p-1.5 rounded-full bg-gray-500/80 text-white hover:bg-gray-600"
                        >
                          <Reply size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-2 backdrop-blur-md bg-black/60 border-t border-white/10 rounded-b-xl">
              {replyingTo && (
                <div className="px-3 py-2 bg-gray-800/60 text-gray-300 text-xs mb-2 rounded flex justify-between items-center">
                  <div className="flex items-center space-x-1 truncate">
                    <Reply size={12} />
                    <span className="truncate">
                      {getMessageById(replyingTo)?.text.substring(0, 30) || "Message not found"}
                      {(getMessageById(replyingTo)?.text.length || 0) > 30 && "..."}
                    </span>
                  </div>
                  <button onClick={cancelReply} className="ml-2">
                    <X size={14} />
                  </button>
                </div>
              )}
              
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
                  className="p-2 rounded-full bg-red-500 text-white"
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

        {callEnded && chatRequestReceived && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-4 rounded-xl z-30 animate-fade-in">
            <p className="text-center text-white mb-3">
              {matchedUser.name} would like to continue chatting after this call
            </p>
            <div className="flex justify-center gap-2">
              <button 
                onClick={handleRejectChatRequest}
                className="px-4 py-2 rounded-full bg-white/10 text-white"
              >
                Decline
              </button>
              <button 
                onClick={handleAcceptChatRequest}
                className="px-4 py-2 rounded-full bg-red-500 text-white"
              >
                Accept
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-14 left-0 right-0 flex justify-center items-center gap-4 z-10">
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
                isChatOpen ? "bg-red-500 text-white" : "bg-white/10 text-white"
              )}
            >
              <MessageCircle size={24} />
            </button>

            <button 
              onClick={handleEndCallInternal}
              className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>

        {callEnded && !requestedChat && !chatAccepted && !chatRequestReceived && (
          <div className="absolute bottom-28 left-0 right-0 flex justify-center z-20">
            <button
              onClick={handleRequestChat}
              className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Request to continue chatting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
