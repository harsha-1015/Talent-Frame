import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, Users, Link as LinkIcon, Sparkles, Star, Film, ArrowRight, Save, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// The main component for character creation and actor matching.
const Character = () => {
  // State for the avatar's image and 3D model URLs
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [glbUrl, setGlbUrl] = useState(null);

  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false); // For matching actors
  const [isSaving, setIsSaving] = useState(false); // For saving to DB
  const [isAvatarLoading, setIsAvatarLoading] = useState(false); // For the avatar image itself

  // State for UI and data
  const [matchingActors, setMatchingActors] = useState([]);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  // State for the 3D model's quality settings
  const [qualitySettings, setQualitySettings] = useState({
    lod: 0, // Level of Detail
    textureQuality: 'medium',
    useDraco: false,
    textureFormat: 'png'
  });
  
  const subdomain = 'demo'; // Use your Ready Player Me subdomain here or 'demo'
  const readyPlayerMeUrl = `https://${subdomain}.readyplayer.me/avatar?clearCache=true&bodyType=fullbody&language=en`;

  /**
   * Handles the avatar URL when it's received from the Ready Player Me iframe.
   * @param {string} url - The exported avatar .png URL.
   */
  const handleAvatarUrlReceived = async (url) => {
    console.log('Avatar URL received from iframe:', url);
    if (!url) {
      console.error('No URL received from iframe');
      setToast({ type: 'error', message: 'Avatar creation failed. Please try again.' });
      return;
    }

    // Extract the unique ID from the URL to construct the .glb model URL
    const avatarId = url.split('/').pop().replace('.png', '');
    const newGlbUrl = `https://models.readyplayer.me/${avatarId}.glb`;

    setAvatarUrl(url);
    setGlbUrl(newGlbUrl);
    setIsAvatarLoading(true); // Show spinner until the new image loads
    setShowAvatarCreator(false); // Hide the creator iframe
    setMatchingActors([]); // Clear previous matches

    // Automatically save the newly created avatar to the database
    await saveAvatarToDatabase(url, newGlbUrl);
  };

  // Effect to listen for messages from the Ready Player Me iframe
  useEffect(() => {
    const handlePostMessage = (event) => {
      // IMPORTANT: Check the origin of the message for security
      if (event.origin !== `https://${subdomain}.readyplayer.me`) {
        return;
      }
      
      // Check if the event is the one we're looking for
      const isAvatarExportEvent = event.data.source === 'readyplayerme' && event.data.eventName === 'v1.avatar.exported';
      if (isAvatarExportEvent) {
        handleAvatarUrlReceived(event.data.url);
      }
    };

    window.addEventListener('message', handlePostMessage);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
  }, []); // The empty dependency array ensures this effect runs only once

  /**
   * Saves the avatar URLs and settings to the backend.
   * @param {string} imageUrl - The URL of the avatar's 2D image.
   * @param {string} modelUrl - The URL of the avatar's 3D model.
   */
  const saveAvatarToDatabase = async (imageUrl, modelUrl) => {
    // A real app would use a more secure auth method
    if (!localStorage.getItem('token')) {
      setToast({ type: 'error', message: 'Please login to save your avatar' });
      return;
    }

    setIsSaving(true);
    try {
      // This is a mock API call. Replace with your actual backend endpoint.
      console.log('Saving avatar to database:', {
        imageUrl,
        modelUrl: getGlbUrl(modelUrl), // Save with current quality settings
        qualitySettings,
      });
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      setToast({ type: 'success', message: 'Avatar saved successfully!' });
    } catch (error) {
      console.error('Error saving avatar:', error);
      setToast({ type: 'error', message: 'Failed to save avatar. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Constructs the full .glb URL with quality parameters.
   * @param {string} baseGlbUrl - The base URL of the .glb file.
   * @returns {string} The complete URL with query parameters.
   */
  const getGlbUrl = (baseGlbUrl = glbUrl) => {
    if (!baseGlbUrl) return null;

    const params = new URLSearchParams();
    if (qualitySettings.lod !== 0) params.append('lod', qualitySettings.lod);
    if (qualitySettings.textureQuality !== 'medium') params.append('textureQuality', qualitySettings.textureQuality);
    if (qualitySettings.useDraco) params.append('useDracoMeshCompression', 'true');
    if (qualitySettings.textureFormat !== 'png') params.append('textureFormat', qualitySettings.textureFormat);
    
    const queryString = params.toString();
    return queryString ? `${baseGlbUrl}?${queryString}` : baseGlbUrl;
  };

  /**
   * Downloads the .glb file to the user's device.
   */
  const downloadGlb = async () => {
    const url = getGlbUrl();
    if (!url) return;

    try {
      setToast({ type: 'success', message: 'Starting download...' });
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = `avatar_${Date.now()}.glb`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error('Error downloading GLB:', error);
      setToast({ type: 'error', message: 'Failed to download avatar model' });
    }
  };

  /**
   * Copies the given text to the clipboard.
   * @param {string} text - The text to copy.
   */
  const copyToClipboard = (text) => {
    if (!text) return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
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
   * Simulates an API call to find matching actors.
   */
  const findMatchingActors = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMatchingActors([
        { id: 1, name: "Alex Rivera", matchScore: 92, image: "https://randomuser.me/api/portraits/men/32.jpg", skills: ["Method Acting", "Martial Arts", "Bilingual"], reel: "#", location: "Los Angeles, CA", experience: "12 years" },
        { id: 2, name: "Sophie Chen", matchScore: 88, image: "https://randomuser.me/api/portraits/women/44.jpg", skills: ["Improvisation", "Dancing", "Accents"], reel: "#", location: "New York, NY", experience: "8 years" },
        { id: 3, name: "James Okafor", matchScore: 85, image: "https://randomuser.me/api/portraits/men/75.jpg", skills: ["Stunt Work", "Singing", "Comedy"], reel: "#", location: "Atlanta, GA", experience: "15 years" },
      ]);
      setIsLoading(false);
    }, 2000);
  };

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
                    Design your character's appearance with our advanced 3D modeling tools
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
              <div className="relative">
                <div className="aspect-video bg-gray-950 flex items-center justify-center p-4 relative">
                  {isAvatarLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-950/50">
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
                <div className="absolute bottom-6 right-6">
                  <button 
                    onClick={() => setShowAvatarCreator(true)}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300 shadow hover:shadow-lg"
                  >
                    <RotateCw className="w-5 h-5 mr-2" />
                    Regenerate
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
                      Avatar Settings & Export
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quality Settings */}
                    <div>
                      <h4 className="font-medium text-gray-400 mb-3">3D Model Quality</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Level of Detail</label>
                          <select 
                            value={qualitySettings.lod}
                            onChange={(e) => setQualitySettings({...qualitySettings, lod: parseInt(e.target.value)})}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                          >
                            <option value={0}>High (Default)</option>
                            <option value={1}>Medium</option>
                            <option value={2}>Low</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Texture Quality</label>
                          <select 
                            value={qualitySettings.textureQuality}
                            onChange={(e) => setQualitySettings({...qualitySettings, textureQuality: e.target.value})}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium (Default)</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Export Options */}
                    <div>
                      <h4 className="font-medium text-gray-400 mb-3">Export Options</h4>
                      <div className="space-y-4">
                        <div className="flex items-center bg-gray-800/50 p-3 rounded-lg">
                          <input 
                            type="checkbox" 
                            id="useDraco"
                            checked={qualitySettings.useDraco}
                            onChange={(e) => setQualitySettings({...qualitySettings, useDraco: e.target.checked})}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-amber-600 focus:ring-amber-500"
                          />
                          <label htmlFor="useDraco" className="ml-3 text-sm text-gray-300">
                            Use Draco Compression <span className="text-gray-500">(smaller file)</span>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Texture Format</label>
                          <select 
                            value={qualitySettings.textureFormat}
                            onChange={(e) => setQualitySettings({...qualitySettings, textureFormat: e.target.value})}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-amber-500 focus:border-amber-500"
                          >
                            <option value="png">PNG (Best quality)</option>
                            <option value="webp">WebP (Good compression)</option>
                            <option value="jpeg">JPEG (Smallest size)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                 {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap gap-3">
                    <button 
                      onClick={() => saveAvatarToDatabase(avatarUrl, glbUrl)}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button onClick={downloadGlb} className="bg-amber-600 hover:bg-amber-700 text-gray-900 px-4 py-2 rounded-lg font-bold flex items-center transition">
                      <Download className="w-5 h-5 mr-2" />
                      Download .GLB
                    </button>
                    <button onClick={() => copyToClipboard(avatarUrl)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition">
                      <LinkIcon className="w-5 h-5 mr-2" />
                      Copy Image URL
                    </button>
                    <button onClick={() => copyToClipboard(getGlbUrl())} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition">
                      <LinkIcon className="w-5 h-5 mr-2" />
                      Copy Model URL
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
