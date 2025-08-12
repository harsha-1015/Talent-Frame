import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import api from "../services/api";
import { motion } from "framer-motion";
import { Film, Clapperboard, Loader2 } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Step 1: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      let profileData;

      try {
        // Step 2: Try to get the user's profile from your backend
        const response = await api.get(`/profile/${user.uid}/`, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        profileData = response.data;
      } catch (profileError) {
        // Step 3: If profile not found (404), create it.
        if (profileError.response?.status === 404) {
          console.log("Profile not found, creating new one...");
          const userType = user.photoURL === 'actor' || user.photoURL === 'filmmaker' ? user.photoURL : 'actor';
          
          // *** FIX: Changed 'name' to 'username' to match the backend view's expectation ***
          const creationResponse = await api.post("/register/", {
            uid: user.uid,
            username: user.displayName, // Corrected key
            email: user.email,
            user_type: userType,
            is_profile_complete: false,
          }, {
            headers: { 'Authorization': `Bearer ${idToken}` }
          });
          profileData = creationResponse.data.user;
        } else {
          throw profileError;
        }
      }

      // Step 4: Update the global state
      if (setCurrentUser) {
        setCurrentUser({ ...user, ...profileData });
      }

      // Step 5: Navigate
      if (profileData.is_profile_complete) {
        navigate("/");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      console.error("Login Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err.message || "An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-400/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-400/10 rounded-full filter blur-3xl"></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 border-b border-amber-400/30">
            <div className="flex items-center justify-center space-x-3">
              <Clapperboard className="h-8 w-8 text-amber-400" />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">TalentFrame Login</h2>
            </div>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && <div className="p-3 bg-red-900/50 text-red-300 border border-red-800 rounded-lg text-center text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-900/50 text-green-300 border border-green-800 rounded-lg text-center text-sm">{success}</div>}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Email</label>
              <input type="email" placeholder="director@talentframe.com" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
            </div>
            <div className="pt-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className={`w-full py-3 px-4 rounded-lg font-bold text-lg text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-500/20'}`}>
                {loading ? <><Loader2 className="h-6 w-6 animate-spin" /><span>Accessing Studio...</span></> : <span>Enter Production Hub</span>}
              </motion.button>
            </div>
          </form>
        </div>
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>New to TalentFrame? <a href="/register" className="font-semibold text-amber-400 hover:text-amber-300">Create an Account</a></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
