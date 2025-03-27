
import React, { useState } from 'react';
import { Camera, Trash2, Plus, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCreationProps {
  existingProfile?: {
    name: string;
    age: number;
    bio: string;
    images: string[];
    interests: string[];
  };
  onSave: (profile: any) => void;
}

const ProfileCreation: React.FC<ProfileCreationProps> = ({ existingProfile, onSave }) => {
  const [name, setName] = useState(existingProfile?.name || '');
  const [age, setAge] = useState(existingProfile?.age || '');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [images, setImages] = useState<string[]>(existingProfile?.images || []);
  const [interests, setInterests] = useState<string[]>(existingProfile?.interests || []);
  const [newInterest, setNewInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Mock image upload - in a real app this would handle actual file uploads
  const handleAddImage = () => {
    // Generate a mock image URL
    const mockImages = [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
    ];
    
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setImages([...images, randomImage]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (index: number) => {
    const newInterests = [...interests];
    newInterests.splice(index, 1);
    setInterests(newInterests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSave({
        name,
        age: Number(age),
        bio,
        images,
        interests
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Profile</h2>
          
          {/* Photos section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Profile Photos</label>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img 
                    src={img} 
                    alt={`Profile ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Trash2 className="text-white" size={20} />
                  </button>
                </div>
              ))}
              
              {images.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Camera size={24} className="mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </div>
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Add up to 6 photos. The first one will be your main profile photo.</p>
          </div>
          
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="age" className="text-sm font-medium">
                Age
              </label>
              <input
                id="age"
                type="number"
                min="18"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="text-sm font-medium">
                About Me
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary min-h-[100px]"
                placeholder="Write something about yourself..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                {bio.length}/500 characters
              </p>
            </div>
          </div>
          
          {/* Interests */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Interests
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map((interest, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                >
                  {interest}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveInterest(idx)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest..."
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="p-2 rounded-lg bg-primary text-primary-foreground"
                disabled={!newInterest.trim()}
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add your interests to help match with like-minded people.
            </p>
          </div>
        </div>
        
        <button
          type="submit"
          className={cn(
            "w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all mt-8 flex items-center justify-center",
            isSaving && "opacity-80 cursor-not-allowed"
          )}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" />
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileCreation;
