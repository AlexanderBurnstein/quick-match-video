
import React, { useState } from 'react';
import ProfileCreation from '@/components/ProfileCreation';
import { Settings, Camera, LogOut, Moon, Sun, Heart, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock user profile
const MOCK_USER_PROFILE = {
  name: 'Alex Morgan',
  age: 29,
  bio: 'Tech enthusiast and avid hiker. Love trying new restaurants and exploring hidden gems in the city. Looking for someone with a sense of adventure and a good sense of humor.',
  images: [
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    'https://images.unsplash.com/photo-1721322800607-8c38375eef04'
  ],
  interests: ['Hiking', 'Technology', 'Food', 'Travel', 'Photography'],
  matches: 12,
  likes: 45,
  joinDate: '2023-12-10'
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(MOCK_USER_PROFILE);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = (updatedProfile: typeof MOCK_USER_PROFILE) => {
    setUserProfile(updatedProfile);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved.",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    toast({
      title: `${isDarkMode ? 'Light' : 'Dark'} mode activated`,
      description: `Theme has been changed to ${isDarkMode ? 'light' : 'dark'} mode.`,
    });
    
    // In a real app, we would apply the dark mode here
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // In a real app, we would handle logout here
  };

  if (isEditing) {
    return (
      <div className="min-h-screen pt-6 pb-24 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-sm text-primary"
          >
            Cancel
          </button>
        </div>
        
        <ProfileCreation
          existingProfile={userProfile}
          onSave={handleSaveProfile}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-24 px-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-full bg-secondary"
        >
          <Settings size={20} className="text-muted-foreground" />
        </button>
      </div>
      
      {/* Profile header */}
      <div className="glass rounded-3xl overflow-hidden mb-6">
        <div className="relative h-48">
          <img 
            src={userProfile.images[0]} 
            alt="Profile cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={userProfile.images[0]} 
                  alt={userProfile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-white shadow-lg"
                onClick={() => setIsEditing(true)}
              >
                <Camera size={16} />
              </button>
            </div>
            
            <div className="ml-4 text-white">
              <h2 className="text-xl font-bold">{userProfile.name}, {userProfile.age}</h2>
              <p className="text-sm text-white/80">Member since {new Date(userProfile.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Stats row */}
        <div className="flex border-t border-gray-200 dark:border-gray-800">
          <div className="flex-1 flex flex-col items-center py-4">
            <div className="flex items-center text-accent mb-1">
              <Heart size={18} />
            </div>
            <p className="font-semibold">{userProfile.likes}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center py-4 border-x border-gray-200 dark:border-gray-800">
            <div className="flex items-center text-primary mb-1">
              <User size={18} />
            </div>
            <p className="font-semibold">{userProfile.matches}</p>
            <p className="text-xs text-muted-foreground">Matches</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center py-4">
            <div className="flex items-center text-primary mb-1">
              {userProfile.interests.length}
            </div>
            <p className="font-semibold">Interests</p>
            <p className="text-xs text-muted-foreground">Listed</p>
          </div>
        </div>
      </div>
      
      {/* Bio section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">About Me</h3>
        <p className="text-muted-foreground">{userProfile.bio}</p>
      </div>
      
      {/* Interests section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {userProfile.interests.map((interest, idx) => (
            <div 
              key={idx} 
              className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
            >
              {interest}
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings */}
      <div className="glass rounded-xl overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-gray-200 dark:border-gray-800">
          Settings
        </h3>
        
        <div>
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors text-left"
          >
            <div className="flex items-center">
              {isDarkMode ? <Moon size={20} className="mr-3" /> : <Sun size={20} className="mr-3" />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div 
              className={cn(
                "w-10 h-6 rounded-full p-1 transition-colors",
                isDarkMode ? "bg-primary" : "bg-gray-300"
              )}
            >
              <div 
                className={cn(
                  "w-4 h-4 rounded-full bg-white transition-transform",
                  isDarkMode ? "translate-x-4" : "translate-x-0"
                )}
              />
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors text-left text-red-500"
          >
            <LogOut size={20} className="mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
