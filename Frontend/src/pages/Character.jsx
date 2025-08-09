import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, Users, Link as LinkIcon, Sparkles, Star, Film, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Character = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchingActors, setMatchingActors] = useState([]);
  const [copied, setCopied] = useState(false);
  const urlRef = useRef(null);

  const handleAvatarCreated = (url) => {
    setAvatarUrl(url);
    setMatchingActors([]); // Clear previous matches when new avatar created
  };

  const findMatchingActors = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMatchingActors([
        {
          id: 1,
          name: "Alex Rivera",
          matchScore: 92,
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          skills: ["Method Acting", "Martial Arts", "Bilingual"],
          reel: "https://example.com/reels/alex",
          location: "Los Angeles, CA",
          experience: "12 years"
        },
        {
          id: 2,
          name: "Sophie Chen",
          matchScore: 88,
          image: "https://randomuser.me/api/portraits/women/44.jpg",
          skills: ["Improvisation", "Dancing", "Accents"],
          reel: "https://example.com/reels/sophie",
          location: "New York, NY",
          experience: "8 years"
        },
        {
          id: 3,
          name: "James Okafor",
          matchScore: 85,
          image: "https://randomuser.me/api/portraits/men/75.jpg",
          skills: ["Stunt Work", "Singing", "Comedy"],
          reel: "https://example.com/reels/james",
          location: "Atlanta, GA",
          experience: "15 years"
        },
        {
          id: 4,
          name: "Maya Patel",
          matchScore: 83,
          image: "https://randomuser.me/api/portraits/women/68.jpg",
          skills: ["Voice Acting", "Motion Capture", "Archery"],
          reel: "https://example.com/reels/maya",
          location: "Vancouver, BC",
          experience: "7 years"
        },
        {
          id: 5,
          name: "Ethan Zhang",
          matchScore: 80,
          image: "https://randomuser.me/api/portraits/men/81.jpg",
          skills: ["Parkour", "Sword Fighting", "Dialect Coaching"],
          reel: "https://example.com/reels/ethan",
          location: "London, UK",
          experience: "10 years"
        },
        {
          id: 6,
          name: "Isabella Morales",
          matchScore: 78,
          image: "https://randomuser.me/api/portraits/women/92.jpg",
          skills: ["Stage Combat", "Singing", "Animal Handling"],
          reel: "https://example.com/reels/isabella",
          location: "Chicago, IL",
          experience: "9 years"
        }
      ]);
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(avatarUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 pt-30 pb-20">
        <div className="absolute inset-0 bg-[url('https://uploads-ssl.webflow.com/62e3ee10882dc50bcae8d07a/631a5d4631d4c55a475f3e34_noise-texture.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1 mb-6">
              <Film className="w-5 h-5 mr-2 text-amber-400" />
              <span className="text-sm font-medium text-amber-400">CHARACTER BUILDER</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-white">Design Your</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-300 to-amber-400">Perfect Character</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Create detailed 3D avatars and let our AI find the perfect actors to bring them to life.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Avatar Creation Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-16"
        >
          <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50 flex items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-amber-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                  Character Creator
                </span>
              </h2>
              <p className="text-gray-400 mt-1">Build your ideal character with our intuitive tools</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs bg-gray-800 text-amber-400 px-3 py-1 rounded-full border border-gray-700">
                Powered by Ready Player Me
              </div>
            </div>
          </div>
          
          {/* Avatar Builder Area */}
          <div className="relative">
            {!avatarUrl ? (
              <div className="aspect-video bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-400/20">
                    <Users className="w-12 h-12 text-amber-400/40" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-300 mb-3">Start Character Creation</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Design your character's appearance with our advanced 3D modeling tools
                  </p>
                </div>
                <button 
                  onClick={() => handleAvatarCreated("https://models.readyplayer.me/example-avatar.png")}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 px-8 py-3 rounded-lg font-bold transition-all duration-300 inline-flex items-center shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                >
                  <span>Launch Character Builder</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-video bg-gray-950 flex items-center justify-center p-4">
                  <img 
                    src={avatarUrl} 
                    alt="Character Avatar" 
                    className="max-h-full max-w-full object-contain rounded-lg shadow-xl"
                  />
                </div>
                <div className="absolute bottom-6 right-6 flex space-x-3">
                  <button 
                    onClick={() => setAvatarUrl(null)}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300 shadow hover:shadow-lg"
                  >
                    <RotateCw className="w-5 h-5 mr-2" />
                    Recreate
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Avatar Preview and Matching Section */}
        {avatarUrl && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            >
              {/* Avatar Preview Card */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-amber-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                    Your Character
                  </span>
                </h3>
                
                <div className="mb-6">
                  <div className="aspect-square bg-gray-950 rounded-xl overflow-hidden border border-gray-800 mb-4">
                    <img 
                      src={avatarUrl} 
                      alt="Character Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setAvatarUrl(null)}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300"
                    >
                      <RotateCw className="w-5 h-5 mr-2" />
                      Recreate
                    </button>
                    <button 
                      onClick={copyToClipboard}
                      className="relative bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300"
                    >
                      <LinkIcon className="w-5 h-5 mr-2" />
                      {copied ? 'Copied!' : 'Copy URL'}
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-6">
                  <h4 className="font-medium text-gray-300 mb-3">Character Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-gray-300">Just now</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type</span>
                      <span className="text-gray-300">Humanoid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format</span>
                      <span className="text-gray-300">3D Avatar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matching Actions Card */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-amber-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                    Find Matches
                  </span>
                </h3>
                
                <div className="mb-6">
                  <p className="text-gray-400 mb-6">
                    Our advanced AI will analyze your character's facial features, proportions, and attributes to find the most suitable actors from our global database.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Search Parameters</label>
                      <div className="grid grid-cols-2 gap-3">
                        <select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                          <option>Gender: Any</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        <select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                          <option>Age Range: Any</option>
                          <option>18-25</option>
                          <option>26-35</option>
                          <option>36-45</option>
                          <option>46+</option>
                        </select>
                        <select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 col-span-2">
                          <option>Location: Worldwide</option>
                          <option>North America</option>
                          <option>Europe</option>
                          <option>Asia</option>
                          <option>Australia</option>
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={findMatchingActors}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Finding Matches...</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>Find Matching Actors</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-6">
                  <h4 className="font-medium text-gray-300 mb-3">Recent Searches</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Lead Character - Hero</span>
                      <span className="text-amber-400">92% match</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Supporting - Villain</span>
                      <span className="text-amber-400">85% match</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Background - Scientist</span>
                      <span className="text-amber-400">78% match</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matching Tips Card */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Film className="w-6 h-6 mr-3 text-amber-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                    Casting Tips
                  </span>
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-400/10 p-2 rounded-lg mr-4">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300 mb-1">Focus on Key Features</h4>
                      <p className="text-gray-400 text-sm">
                        Highlight the most distinctive facial features of your character for better matches.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-400/10 p-2 rounded-lg mr-4">
                      <Users className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300 mb-1">Consider Range</h4>
                      <p className="text-gray-400 text-sm">
                        Broaden your search parameters to discover actors who can transform into the role.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-400/10 p-2 rounded-lg mr-4">
                      <Star className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300 mb-1">Review Reels</h4>
                      <p className="text-gray-400 text-sm">
                        Always watch actor demo reels to assess their range and suitability.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 pt-6 mt-6">
                  <Link
                    to="/match"
                    className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium transition-colors duration-300"
                  >
                    <span>View All Casting Resources</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Matching Results Section */}
        {matchingActors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-amber-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                    Top Matching Actors
                  </span>
                </h2>
                <p className="text-gray-400">
                  {matchingActors.length} actors matched your character's profile
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  to="/match"
                  className="inline-flex items-center border border-amber-400 text-amber-400 hover:bg-amber-400/10 px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  <span>View All Matches</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingActors.slice(0, 3).map((actor) => (
                <motion.div
                  key={actor.id}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 shadow-lg"
                >
                  <div className="relative aspect-[3/4] bg-gray-900">
                    <img 
                      src={actor.image} 
                      alt={actor.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="font-bold text-white text-xl">{actor.name}</h3>
                          <p className="text-sm text-gray-300">{actor.location}</p>
                        </div>
                        <div className="flex items-center bg-amber-500 text-gray-900 text-sm font-bold px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 mr-1" />
                          {actor.matchScore}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Experience</h4>
                        <p className="text-gray-400">{actor.experience}</p>
                      </div>
                      <a 
                        href={actor.reel} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center"
                      >
                        View Reel
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {actor.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full border border-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                        Save
                      </button>
                      <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-300">
                        Contact
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Character;