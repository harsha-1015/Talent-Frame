import React, { useState } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, updateProfile, getIdToken } from "firebase/auth";
import api from "../services/api";
import axios from "axios";
import { motion } from "framer-motion";
import { Film, Clapperboard, User, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("actor");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user in Firebase only
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile with username
      await updateProfile(userCredential.user, { 
        displayName: username,
        photoURL: userType // Storing user_type in photoURL for now
      });
      
      // Save email and userType to localStorage for use after login
      localStorage.setItem('pendingRegistration', JSON.stringify({
        email,
        username,
        userType
      }));
      
      // Sign out the user - they'll need to log in to continue
      await auth.signOut();
      
      // Redirect to login page
      navigate('/login');
      alert('Registration successful! Please log in to continue.');
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-16 relative overflow-hidden">
      {/* Cinematic background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900"></div>
        <div className="absolute inset-0 bg-film-strip-pattern opacity-20"></div>
      </div>
      
      {/* Light flare effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-400/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-400/10 rounded-full filter blur-3xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Header with film strip effect */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 border-b border-amber-400/30 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-30"></div>
            <div className="flex items-center justify-center space-x-3">
              <Clapperboard className="h-8 w-8 text-amber-400" />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                Join TalentFrame
              </h2>
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-400">Stage Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-amber-400/80" />
                </div>
                <input
                  type="text"
                  placeholder="Your professional name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-400">Email</label>
              <input
                type="email"
                placeholder="your@talentframe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-400">I am a...</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Video className="h-5 w-5 text-amber-400/80" />
                </div>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
                >
                  <option value="actor">Actor/Performer</option>
                  <option value="filmmaker">Filmmaker/Crew</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loading
                    ? 'bg-amber-600/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <Film className="h-5 w-5" />
                    <span>Start Your Journey</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center pt-4 text-sm text-gray-400"
            >
              <p>By registering, you agree to our <a href="#" className="text-amber-400 hover:text-amber-300">Terms</a> and <a href="#" className="text-amber-400 hover:text-amber-300">Privacy Policy</a></p>
            </motion.div>
          </form>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          <p>Already have an account? <a href="/login" className="text-amber-400 hover:text-amber-300">Sign in</a></p>
        </motion.div>
      </motion.div>
    </div>
  );
}