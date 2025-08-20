import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Star, Film, Phone, Mail, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../services/firebase';

// --- (New) A reusable component just for displaying an avatar ---
// This component is simple and only cares about what URL to display.
const AvatarDisplay = ({ avatarUrl, isLoading, error }) => {
  if (isLoading) {
    return <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-500"></div>;
  }

  if (error) {
    return <img src="https://placehold.co/64x64/111827/9CA3AF?text=N/A" alt="Error loading avatar" className="w-full h-full object-cover" />;
  }

  return (
    <img 
      src={avatarUrl} 
      alt="Character Avatar" 
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://placehold.co/64x64/111827/9CA3AF?text=Error';
      }}
    />
  );
};


// --- (Modified) The Match component no longer fetches data. ---
// It's now a "presentational" component that receives the avatar info via props.
const Matchs = ({ characterAvatarUrl, isLoadingAvatar, avatarError }) => {
  const matches = [
    {
      id: 1,
      name: "Alex Rivera",
      matchScore: 92,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Los Angeles, CA",
      skills: ["Method Acting", "Martial Arts", "Bilingual"],
      reel: "#",
      phone: "+1 (555) 123-4567",
      email: "alex.rivera@example.com"
    },
    {
      id: 2,
      name: "Sophie Chen",
      matchScore: 88,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      location: "New York, NY",
      skills: ["Improvisation", "Dancing", "Accents"],
      reel: "#",
      phone: "+1 (555) 987-6543",
      email: "sophie.chen@example.com"
    },
    // ... other matches
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8"
          >
            <div>
              <a
                href="#character" // Changed to hash link to prevent page reload
                className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Character
              </a>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                  Matching Results
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                Actors best matching your created character
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center">
              <div className="mr-4 flex-shrink-0">
                {/* --- (Modified) This section now uses the AvatarDisplay component --- */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-amber-400/30 bg-gray-800 flex items-center justify-center">
                  <AvatarDisplay 
                    avatarUrl={characterAvatarUrl} 
                    isLoading={isLoadingAvatar}
                    error={avatarError}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Searching for:</p>
                <p className="text-lg font-medium text-amber-400">Main Character</p>
                <p className="text-sm text-gray-400">{matches.length} matches found</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Matches Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matches.map((actor) => (
            <motion.div
              key={actor.id}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 shadow-lg"
            >
              {/* Actor Card Content... */}
               <div className="relative">
                <div className="aspect-[4/3] bg-gray-950">
                  <img 
                    src={actor.image} 
                    alt={actor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-bold text-white">{actor.name}</h2>
                      <p className="text-sm text-gray-300">{actor.location}</p>
                    </div>
                    <div className="flex items-center bg-amber-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      <Star className="w-4 h-4 mr-1" />
                      {actor.matchScore}%
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


// --- (New) This is our main App component. It controls the state. ---
// This is where the data fetching happens.
function Match() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Set up Firebase auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is signed in:', user.uid);
        setCurrentUser(user);
        // Store UID in localStorage for future use if needed
        localStorage.setItem('characterUid', user.uid);
        
        // If there's no avatar URL in state, fetch it
        if (!avatarUrl) {
          getAvatarData(user.uid);
        }
      } else {
        console.log('No user is signed in');
        setCurrentUser(null);
        setError('Please sign in to view this page');
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const getAvatarData = useCallback(async (uid) => {
    if (!uid) {
      console.error('No UID provided to getAvatarData');
      setError('No user ID found. Please sign in again.');
      setIsLoading(false);
      return;
    }
    
    console.log('Fetching avatar data for UID:', uid);
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the Firebase ID token for authentication
      const idToken = await auth.currentUser.getIdToken();
      const apiUrl = `/api/avatar/get/${uid}/`;
      
      console.log('Making request to:', apiUrl);
      
      // Make the API call with the UID and authorization
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
      });
      
      // Get the response text first to check if it's JSON
      const responseText = await response.text();
      
      // Log the raw response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response text:', responseText);
      
      // Check if the response is JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch avatar. Status: ${response.status}`);
      }

      if (!data.avatarUrl) {
        throw new Error('No avatar URL found in response');
      }
      
      setAvatarUrl(data.avatarUrl);
      
    } catch (err) {
      console.error("Failed to fetch avatar:", err);
      setError(err.message || 'Failed to load avatar. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <Matchs
        characterAvatarUrl={avatarUrl} 
        isLoadingAvatar={isLoading}
        avatarError={error}
      />
    </div>
  );
}

export default Match;
