import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";
import { motion } from "framer-motion";
import { Film, Clapperboard, User, Video, Loader2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState(""); // No default, force user to choose
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userType) {
      setError("Please select whether you are an Actor or Filmmaker.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Step 1: Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Update the Firebase profile.
      // displayName is standard. We temporarily store userType in photoURL.
      await updateProfile(user, {
        displayName: username,
        photoURL: userType, // This is the key change to pass the userType
      });

      // Step 3: Sign the user out immediately.
      await auth.signOut();

      // Step 4: Redirect to the login page with a success message.
      navigate('/login', {
        state: {
          successMessage: 'Registration successful! Please log in to continue.'
        }
      });

    } catch (err) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email address is already registered. Please try logging in.");
      } else if (err.code === 'auth/weak-password') {
        setError("The password must be at least 6 characters long.");
      } else {
        setError(err.message || "An unknown error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-400/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-400/10 rounded-full filter blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 border-b border-amber-400/30">
            <div className="flex items-center justify-center space-x-3">
              <Clapperboard className="h-8 w-8 text-amber-400" />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                Join TalentFrame
              </h2>
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-900/50 text-red-300 border border-red-800 rounded-lg text-center text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Stage Name</label>
              <div className="relative">
                <User className="absolute inset-y-0 left-0 pl-3 h-full w-5 text-amber-400/80 pointer-events-none" />
                <input type="text" placeholder="Your professional name" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Email</label>
              <input type="email" placeholder="your@talentframe.com" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-400">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setUserType('actor')} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${userType === 'actor' ? 'bg-amber-500/20 border-amber-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}`}>
                  <User className="h-8 w-8 mb-2" />
                  <span className="font-semibold">Actor</span>
                </button>
                <button type="button" onClick={() => setUserType('filmmaker')} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${userType === 'filmmaker' ? 'bg-amber-500/20 border-amber-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}`}>
                  <Video className="h-8 w-8 mb-2" />
                  <span className="font-semibold">Filmmaker</span>
                </button>
              </div>
            </div>
            <div className="pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-lg font-bold text-lg text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-500/20'}`}>
                {loading ? <><Loader2 className="h-6 w-6 animate-spin" /><span>Creating Account...</span></> : <span>Start Your Journey</span>}
              </motion.button>
            </div>
          </form>
        </div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Already have an account? <a href="/login" className="font-semibold text-amber-400 hover:text-amber-300">Sign In</a></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
