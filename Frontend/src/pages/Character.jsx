import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RotateCw, Users, Link as LinkIcon, Sparkles, Star, Film, ArrowRight, Save, Download, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { auth } from '../services/firebase';

// The main component for character creation and actor matching.
const Character = () => {
  // State for the avatar's image
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarId, setAvatarId] = useState(null); // To store the base ID for re-rendering
  const [actualImageURL, setActualImageURL] = useState(null); // To store the actual image URL
  const [user, setUser] = useState(null); // To store the current user's data

  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false); // For matching actors
  const [isSaving, setIsSaving] = useState(false); // For saving to DB
  const [isAvatarLoading, setIsAvatarLoading] = useState(false); // For the avatar image itself

  // State for UI and data
  const [matchingActors, setMatchingActors] = useState([]);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [hasBeenSaved, setHasBeenSaved] = useState(false); // Tracks if the initial save has happened

  // State for the 2D render settings
  const [renderSettings, setRenderSettings] = useState({
    camera: 'portrait',
    expression: 'happy',
    pose: 'standing',
  });

  // The subdomain for Ready Player Me. Using 'demo' for this example.
  const subdomain = import.meta.env.VITE_READYPLAYERME_SUBDOMAIN; // Replace with your actual Ready Player Me subdomain from your .env file if needed
  const readyPlayerMeUrl = `https://${subdomain}.readyplayer.me/avatar?clearCache=true&bodyType=fullbody&language=en&frameApi`;

  /**
   * Handles the initial avatar URL when it's received from the Ready Player Me iframe.
   */
  const handleAvatarUrlReceived = useCallback((url) => {
    console.log('Avatar URL received from iframe:', url);
    if (!url || typeof url !== 'string') {
      console.error('Invalid or no URL received from iframe:', url);
      setToast({ type: 'error', message: 'Avatar creation failed. Please try again.' });
      return;
    }

    try {
      // The received URL can be a .glb, so we robustly remove either extension to get the ID.
      const pngURL = url.replace(".glb", ".png");
      const newAvatarId = new URL(url).pathname.split('/').pop().replace('.png', '').replace('.glb', '');
      console.log('Parsed Avatar ID:', newAvatarId);
      setActualImageURL(pngURL); // Store the actual image URL
      setAvatarId(newAvatarId); // Store the base ID
      setIsAvatarLoading(true);
      setShowAvatarCreator(false);
      setMatchingActors([]);
      setHasBeenSaved(false);
    } catch (error) {
        console.error("Error parsing avatar URL:", error);
        setToast({ type: 'error', message: 'Received an invalid avatar URL.' });
    }
  }, []);

  // Effect to listen for messages from the Ready Player Me iframe
  useEffect(() => {
    const handlePostMessage = (event) => {
      if (event.origin !== `https://${subdomain}.readyplayer.me`) {
        return;
      }
      
      // const isAvatarExportEvent = event.data?.source === 'readyplayerme' && event.data?.eventName === 'v1.avatar.exported';
      
      if (event.data) {
        console.log('Avatar export event received:', event.data);
        handleAvatarUrlReceived(event.data);
      }
    };
    
    window.addEventListener('message', handlePostMessage);
    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, [subdomain, handleAvatarUrlReceived]);

  // Get the current user from Firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log('Firebase auth state changed:', currentUser);
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email
          // Add any other user properties you need
        });
      } else {
        setUser(null);
        setToast({ type: 'error', message: 'Please sign in to save your avatar' });
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Save avatar to backend when avatarId or actualImageURL changes
  useEffect(() => {
    const saveAvatarToBackend = async () => {
      if (avatarId && actualImageURL && user?.uid) {
        try {
          setIsSaving(true);
          const response = await api.post('avatar/store/', {
            uid: user.uid,
            avatarId: avatarId,
            avatarUrl: actualImageURL
          });
          
          if (!response.ok) {
            const errorData = response.data || {};
            throw new Error(errorData.error || 'Failed to save avatar');
          }
          
          setToast({ type: 'success', message: 'Avatar saved successfully!' });
          setHasBeenSaved(true);
        } catch (error) {
          console.error('Error saving avatar:', error);
          setToast({ 
            type: 'error', 
            message: error.message || 'Failed to save avatar. Please try again.'
          });
        } finally {
          setIsSaving(false);
        }
      }
    };

    // Only save if it hasn't been saved yet
    if (!hasBeenSaved) {
      saveAvatarToBackend();
    }
  }, [avatarId, actualImageURL, user, hasBeenSaved]);

  // Effect to update the avatar URL when render settings change
  useEffect(() => {
    if (!avatarId) return;

    const params = new URLSearchParams();
    if (renderSettings.camera && renderSettings.camera !== 'portrait') params.append('camera', renderSettings.camera);
    if (renderSettings.expression) params.append('expression', renderSettings.expression);
    if (renderSettings.pose) params.append('pose', renderSettings.pose);
    
    const queryString = params.toString();
    const newAvatarUrl = `https://models.readyplayer.me/${avatarId}.png${queryString ? `?${queryString}` : ''}`;
    
    if (newAvatarUrl !== avatarUrl) {
        setIsAvatarLoading(true);
        setAvatarUrl(newAvatarUrl);
    }
  }, [avatarId, renderSettings, avatarUrl]);


  /**
   * Copies the given text to the clipboard.
   */
  const copyToClipboard = (text) => {
    if (!text) return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setToast({ type: 'success', message: 'Copied to clipboard!' });
    } catch (err) {
      console.error('Failed to copy: ', err);
      setToast({ type: 'error', message: 'Failed to copy URL.' });
    }
    document.body.removeChild(textArea);
  };

  /**
   * Saves the avatar to the backend and then finds matching actors.
   */
  const navigate = useNavigate();

  const findMatchingActors = async () => {
    if (!avatarUrl) {
      setToast({ type: 'error', message: 'Please create an avatar first.' });
      return;
    }

    setIsLoading(true);

    // --- Save avatar URL to the backend ---
    if (!user || !user.uid) {
      setToast({ type: 'error', message: 'User not authenticated. Please log in.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('avatar/store/', {
        avatarUrl: avatarUrl,
        uid: user.uid,
        avatarId: avatarId
      });

      if (!response.ok) {
        // Handle HTTP errors like 404, 500 etc.
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const result = await response.data;
      console.log('Backend response:', result);
      setToast({ type: 'success', message: 'Finding matching actors...' });
      
      // Redirect to the match page
      navigate('/match');
      
    } catch (error) {
      console.error('Failed to send avatar to backend:', error);
      setToast({ type: 'error', message: 'Could not save avatar to backend.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to auto-dismiss toast after a few seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '50%' }}
            animate={{ opacity: 1, y: 0, x: '50%' }}
            exit={{ opacity: 0, y: 20, x: '50%' }}
            className={`fixed bottom-4 right-1/2 px-4 py-2 rounded-lg shadow-lg ${
              toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            } text-white flex items-center z-50`}
          >
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-4 text-lg font-bold">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 pt-32 pb-20">
        <div className="absolute inset-0 bg-[url('https://uploads-ssl.webflow.com/62e3ee10882dc50bcae8d07a/631a5d4631d4c55a475f3e34_noise-texture.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
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
              Create detailed 2D avatars and let our AI find the perfect actors to bring them to life.
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
          <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-amber-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                  Character Creator
                </span>
              </h2>
              <p className="text-gray-400 mt-1">Build your ideal character with our intuitive tools</p>
            </div>
            <div className="text-xs bg-gray-800 text-amber-400 px-3 py-1 rounded-full border border-gray-700">
              Powered by Ready Player Me
            </div>
          </div>
          
          {/* Avatar Builder Area */}
          <div className="relative">
            {!showAvatarCreator && !avatarUrl ? (
              <div className="aspect-video bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-400/20">
                    <Users className="w-12 h-12 text-amber-400/40" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-300 mb-3">Start Character Creation</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Design your character's appearance with our advanced tools
                  </p>
                </div>
                <button 
                  onClick={() => setShowAvatarCreator(true)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 px-8 py-3 rounded-lg font-bold transition-all duration-300 inline-flex items-center shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                >
                  <span>Launch Character Builder</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            ) : showAvatarCreator ? (
              <div style={{ height: '600px' }}>
                <iframe
                  src={readyPlayerMeUrl}
                  title="Ready Player Me Avatar Creator"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="camera *; microphone *"
                />
              </div>
            ) : (
              <div className="p-6">
                <div className="relative">
                  <div className="aspect-video bg-gray-950 flex items-center justify-center p-4 relative rounded-lg">
                    {isAvatarLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-950/50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                      </div>
                    )}
                    <img 
                      src={avatarUrl} 
                      alt="Character Avatar" 
                      className={`max-h-full max-w-full object-contain rounded-lg shadow-xl transition-opacity duration-500 ${isAvatarLoading ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setIsAvatarLoading(false)}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://placehold.co/600x400/0a0a0a/eab308?text=Error+Loading";
                        setIsAvatarLoading(false);
                        setToast({type: 'error', message: 'Could not load avatar image.'});
                      }}
                    />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button 
                      onClick={() => setShowAvatarCreator(true)}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300 shadow hover:shadow-lg"
                    >
                      <RotateCw className="w-5 h-5 mr-2" />
                      Regenerate
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                   <button
                     onClick={() => {
                       if (avatarId && actualImageURL && user?.uid) {
                         setHasBeenSaved(false); // Reset to trigger the save effect
                       }
                     }}
                     disabled={isSaving || hasBeenSaved || !avatarId}
                     className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 inline-flex items-center justify-center shadow-lg disabled:opacity-60
                       ${hasBeenSaved 
                         ? 'bg-green-600 text-white cursor-not-allowed' 
                         : !avatarId 
                           ? 'bg-gray-400 cursor-not-allowed text-white'
                           : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/20 hover:shadow-blue-500/30'
                       }`
                     }
                   >
                     {isSaving ? (
                       <>
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         Saving...
                       </>
                     ) : hasBeenSaved ? (
                       <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Saved
                       </>
                     ) : (
                       <>
                         <Save className="w-5 h-5 mr-2" />
                         Save to Collection
                       </>
                     )}
                   </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Avatar Settings and Matching Section */}
        {avatarUrl && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            >
              {/* Avatar Settings Card */}
              <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Star className="w-6 h-6 mr-3 text-amber-400" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                      Avatar Settings
                    </span>
                  </h3>
                  {/* 2D Render Settings */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-400 mb-3">2D Render Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Camera</label>
                            <select 
                                value={renderSettings.camera}
                                onChange={(e) => setRenderSettings({...renderSettings, camera: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="portrait">Portrait (Default)</option>
                                <option value="fullbody">Full Body</option>
                                <option value="fit">Fit</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Expression</label>
                            <select 
                                value={renderSettings.expression}
                                onChange={(e) => setRenderSettings({...renderSettings, expression: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="happy">Happy</option>
                                <option value="lol">LOL</option>
                                <option value="sad">Sad</option>
                                <option value="scared">Scared</option>
                                <option value="rage">Rage</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Pose</label>
                            <select 
                                value={renderSettings.pose}
                                onChange={(e) => setRenderSettings({...renderSettings, pose: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="standing">Standing</option>
                                <option value="power-stance">Power Stance</option>
                                <option value="relaxed">Relaxed</option>
                                <option value="thumbs-up">Thumbs Up</option>
                            </select>
                        </div>
                    </div>
                  </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap gap-3">
                  <button onClick={() => copyToClipboard(avatarUrl)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition">
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Copy Image URL
                  </button>
                </div>
              </div>

              {/* Matching Actions Card */}
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Film className="w-6 h-6 mr-3 text-amber-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                    Find Actors
                  </span>
                </h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  Our AI will analyze your character to find suitable actors from our global database.
                </p>
                <button
                  onClick={findMatchingActors}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
                {/* This Link component requires react-router-dom to be set up in the app's entry point */}
                <a 
                  href="/match" 
                  className="inline-flex items-center border border-amber-400 text-amber-400 hover:bg-amber-400/10 px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  <span>View All Matches</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingActors.map((actor) => (
                <motion.div
                  key={actor.id}
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 shadow-lg"
                >
                  <div className="relative aspect-[3/4] bg-gray-900">
                    <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
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
                      <a href={actor.reel} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center">
                        View Reel
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {actor.skills.map((skill, index) => (
                        <span key={index} className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full border border-gray-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">Save</button>
                      <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-300">Contact</button>
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
