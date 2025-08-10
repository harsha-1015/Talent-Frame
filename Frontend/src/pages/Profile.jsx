import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Edit, Film, Trash2, Settings, Bell, Lock, Users as Connections, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    skills: [],
    profileImage: "",
    reel: "",
    reelDescription: "",
    connections: [],
    privacy: {
      profileVisibility: "public",
      reelVisibility: "connections",
      notifications: true
    }
  });
  const [newConnectionSearch, setNewConnectionSearch] = useState("");

  // Load user data on component mount
  useEffect(() => {
    if (currentUser) {
      // Set initial form data from currentUser
      setProfile(prev => ({
        ...prev,
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        skills: currentUser.skills || [],
        profileImage: currentUser.photoURL || ""
      }));
      
      // Set edit mode to true if profile is not complete
      if (!currentUser.is_profile_complete) {
        setEditMode(true);
      }
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isProfileComplete()) {
      setError("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      // Update the user's profile
      const response = await api.put(`/user/${currentUser.uid}/`, {
        ...profile,
        is_profile_complete: true  // Mark as complete when submitting the form
      });
      
      // Update the current user in context
      setCurrentUser(prev => ({
        ...prev,
        ...response.data.user,
        is_profile_complete: true
      }));
      
      // Redirect to home page after successful update
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) }));
  };

  const handlePrivacyChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
  };

  const handleReelUpload = (e) => {
    // In a real app, this would handle file upload
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        reel: URL.createObjectURL(file),
        reelDescription: file.name
      }));
    }
  };

  const removeReel = () => {
    setProfile(prev => ({ ...prev, reel: null, reelDescription: "" }));
  };

  const removeConnection = (id) => {
    setProfile(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== id)
    }));
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    const requiredFields = [profile.name, profile.bio, profile.location];
    return requiredFields.every(field => field && field.trim() !== '');
  };

  const saveChanges = async () => {
    if (!isProfileComplete()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare the profile data to send
      const profileData = {
        username: profile.name,
        email: profile.email,
        bio: profile.bio,
        location: profile.location,
        skills: profile.skills,
        is_profile_complete: true
      };

      // Update the user's profile in the backend
      const response = await api.put(`/profile/${currentUser.uid}/`, profileData);

      // Update the current user in context
      setCurrentUser(prev => ({
        ...prev,
        ...response.data.user,
        displayName: profile.name,
        photoURL: profile.profileImage,
        is_profile_complete: true
      }));

      // Show success message
      alert('Profile updated successfully!');
      
      // Redirect to home page after successful update
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
              My Profile
            </span>
          </motion.h1>
          <p className="text-lg text-gray-400">Manage your account and professional information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personal Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Personal Info Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <User className="w-6 h-6 mr-3 text-amber-400" />
                Personal Information
              </h2>
              <button 
                onClick={() => setEditMode(!editMode)}
                className="text-amber-400 hover:text-amber-300 flex items-center"
              >
                <Edit className="w-5 h-5 mr-1" />
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture */}
                <div className="md:w-1/3">
                  <div className="relative group">
                    <div className="aspect-square bg-gray-950 rounded-xl overflow-hidden border-2 border-gray-700 mb-4">
                      <img 
                        src={profile.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {editMode && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <label className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-lg font-medium cursor-pointer">
                          Change
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setProfile(prev => ({
                                  ...prev,
                                  profileImage: URL.createObjectURL(file)
                                }));
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-1">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Email</label>
                    <p className="text-white flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-gray-400" />
                      {profile.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Location</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    ) : (
                      <p className="text-white flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                        {profile.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Bio</label>
                    {editMode ? (
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.bio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1">Skills</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={profile.skills.join(', ')}
                        onChange={(e) => handleArrayChange('skills', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                        placeholder="Comma separated list"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {editMode && (
                    <div className="pt-4">
                      <button
                        onClick={saveChanges}
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-lg font-bold flex items-center"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reel Upload Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
              <h2 className="text-xl font-bold flex items-center">
                <Film className="w-6 h-6 mr-3 text-amber-400" />
                Director's Reel
              </h2>
            </div>

            <div className="p-6">
              {profile.reel ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-950 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Film className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                      <p className="text-gray-400">Reel preview would appear here</p>
                      <p className="text-sm text-gray-500 mt-2">{profile.reelDescription}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <label className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                      Replace Reel
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="video/*"
                        onChange={handleReelUpload}
                      />
                    </label>
                    <button
                      onClick={removeReel}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Remove Reel
                    </button>
                  </div>
                  {editMode && (
                    <div>
                      <label className="block text-gray-400 mb-1">Reel Description</label>
                      <input
                        type="text"
                        value={profile.reelDescription}
                        onChange={(e) => setProfile(prev => ({ ...prev, reelDescription: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                  <Film className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Upload Your Director's Reel</h3>
                  <p className="text-gray-500 mb-4">Showcase your best work to potential collaborators</p>
                  <label className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-lg font-bold inline-flex items-center cursor-pointer">
                    <Film className="w-5 h-5 mr-2" />
                    Select Video File
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="video/*"
                      onChange={handleReelUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Connections & Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Connections Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
              <h2 className="text-xl font-bold flex items-center">
                <Connections className="w-6 h-6 mr-3 text-amber-400" />
                Connections ({profile.connections.length})
              </h2>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={newConnectionSearch}
                  onChange={(e) => setNewConnectionSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="space-y-4">
                {profile.connections
                  .filter(conn => 
                    conn.name.toLowerCase().includes(newConnectionSearch.toLowerCase())
                  )
                  .map(connection => (
                    <div key={connection.id} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={connection.avatar} 
                            alt={connection.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-sm text-gray-400">{connection.status}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-amber-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                        </button>
                        {editMode && (
                          <button 
                            onClick={() => removeConnection(connection.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Privacy & Settings Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
              <h2 className="text-xl font-bold flex items-center">
                <Settings className="w-6 h-6 mr-3 text-amber-400" />
                Privacy & Settings
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium flex items-center mb-3">
                  <Lock className="w-5 h-5 mr-2 text-gray-400" />
                  Profile Visibility
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="profileVisibility"
                      checked={profile.privacy.profileVisibility === "public"}
                      onChange={() => handlePrivacyChange("profileVisibility", "public")}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Public (Visible to everyone)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="profileVisibility"
                      checked={profile.privacy.profileVisibility === "connections"}
                      onChange={() => handlePrivacyChange("profileVisibility", "connections")}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Connections only</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="profileVisibility"
                      checked={profile.privacy.profileVisibility === "private"}
                      onChange={() => handlePrivacyChange("profileVisibility", "private")}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Private (Only visible to me)</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium flex items-center mb-3">
                  <Film className="w-5 h-5 mr-2 text-gray-400" />
                  Reel Visibility
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="reelVisibility"
                      checked={profile.privacy.reelVisibility === "public"}
                      onChange={() => handlePrivacyChange("reelVisibility", "public")}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Public (Visible to everyone)</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="reelVisibility"
                      checked={profile.privacy.reelVisibility === "connections"}
                      onChange={() => handlePrivacyChange("reelVisibility", "connections")}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Connections only</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="reelVisibility"
                      checked={profile.privacy.reelVisibility === "private"}
                      onChange={() => handlePrivacyChange("reelVisibility", "private")}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span>Private (Only visible to me)</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium flex items-center mb-3">
                  <Bell className="w-5 h-5 mr-2 text-gray-400" />
                  Notifications
                </h3>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.privacy.notifications}
                    onChange={(e) => handlePrivacyChange("notifications", e.target.checked)}
                    className="text-amber-500 rounded focus:ring-amber-500"
                  />
                  <span>Receive email notifications</span>
                </label>
              </div>

              <button
                onClick={saveChanges}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-lg font-bold flex items-center justify-center w-full"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;