import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Edit, Film, Trash2, Settings, Bell, Lock, Users as Connections, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

// Constants
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(!currentUser?.is_profile_complete);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    bio: currentUser?.bio || "",
    location: currentUser?.location || "",
    profileImage: currentUser?.photoURL || "",
    skills: currentUser?.skills || [],
    availability: currentUser?.availability || "inactive",
    moviesDone: currentUser?.moviesDone || 0,
    lookingForCast: currentUser?.lookingForCast || false,
    reel: currentUser?.reel || null,
    reelDescription: currentUser?.reelDescription || "",
    connections: currentUser?.connections || [],
    privacy: {
      profileVisibility: currentUser?.privacy?.profileVisibility || "public",
      reelVisibility: currentUser?.privacy?.reelVisibility || "connections",
      notifications: currentUser?.privacy?.notifications || true
    }
  });

  const [newConnectionSearch, setNewConnectionSearch] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await api.get(`/users/profile/${currentUser.uid}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const profileData = response.data;
      const updatedProfile = {
        name: profileData.name || currentUser.displayName || "",
        email: profileData.email || currentUser.email || "",
        bio: profileData.bio || "",
        location: profileData.location || "",
        profileImage: profileData.profile_picture || currentUser.photoURL || "",
        skills: Array.isArray(profileData.skills) ? profileData.skills : 
               typeof profileData.skills === 'string' ? 
               profileData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
        availability: profileData.availability || "inactive",
        moviesDone: profileData.movies_done || 0,
        lookingForCast: profileData.looking_for_cast || false,
        reel: profileData.reel || null,
        reelDescription: profileData.reel_description || "",
        connections: profileData.connections || [],
        privacy: {
          profileVisibility: profileData.privacy?.profile_visibility || "public",
          reelVisibility: profileData.privacy?.reel_visibility || "connections",
          notifications: profileData.privacy?.notifications || true
        }
      };

      setProfile(updatedProfile);
      localStorage.setItem('profileData', JSON.stringify(updatedProfile));

      if (setCurrentUser) {
        setCurrentUser(prev => ({
          ...prev,
          ...updatedProfile,
          is_profile_complete: profileData.is_profile_complete || false
        }));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data. Using cached data if available.');
      
      const savedProfile = localStorage.getItem('profileData');
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          setProfile(profileData);
        } catch (e) {
          console.error('Error parsing saved profile:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Validate profile completion
  const isProfileComplete = useCallback(() => {
    const requiredFields = {
      common: ['name', 'email', 'bio'],
      actor: ['skills', 'availability'],
      filmmaker: ['moviesDone', 'lookingForCast']
    };

    // Check common fields
    for (const field of requiredFields.common) {
      if (!profile[field] || (typeof profile[field] === 'string' && profile[field].trim() === '')) {
        return false;
      }
    }

    // Check role-specific fields
    if (currentUser?.userType === 'actor') {
      return profile.skills && profile.skills.length > 0;
    } else if (currentUser?.userType === 'filmmaker') {
      return profile.moviesDone !== undefined && profile.lookingForCast !== undefined;
    }

    return false;
  }, [profile, currentUser]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) || 0 : 
              value
    }));
  };

  // Handle skill changes
  const handleSkillChange = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newSkill = e.target.value.trim();
      if (!profile.skills.includes(newSkill)) {
        setProfile(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
        }));
        e.target.value = '';
      }
    }
  };

  const removeSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image');
    }
  };

  // Handle reel upload
  const handleReelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate video
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setError('Only MP4, WebM, and QuickTime videos are allowed');
      return;
    }

    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('reel', file);

      const token = await currentUser.getIdToken();
      const response = await api.put(`/profile/${currentUser.uid}/reel`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setProfile(prev => ({
        ...prev,
        reel: response.data.reelUrl,
        reelDescription: file.name
      }));
    } catch (error) {
      console.error('Error uploading reel:', error);
      setError('Failed to upload reel');
    } finally {
      setUploadProgress(0);
    }
  };

  const removeReel = async () => {
    try {
      const token = await currentUser.getIdToken();
      await api.delete(`/profile/${currentUser.uid}/reel`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setProfile(prev => ({
        ...prev,
        reel: null,
        reelDescription: ""
      }));
    } catch (error) {
      console.error('Error removing reel:', error);
      setError('Failed to remove reel');
    }
  };

  // Handle privacy changes
  const handlePrivacyChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
  };

  const removeConnection = (id) => {
    setProfile(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== id)
    }));
  };

  // Save profile changes
  const saveChanges = async () => {
    if (loading) return;
    
    if (!isProfileComplete()) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        location: profile.location,
        is_profile_complete: true,
        user_type: currentUser.userType,
        skills: profile.skills,
        availability: profile.availability,
        movies_done: profile.moviesDone,
        looking_for_cast: profile.lookingForCast,
        reel_description: profile.reelDescription,
        privacy: {
          profile_visibility: profile.privacy.profileVisibility,
          reel_visibility: profile.privacy.reelVisibility,
          notifications: profile.privacy.notifications
        }
      };

      // Handle profile image upload if changed
      if (profile.profileImage && profile.profileImage.startsWith('data:image')) {
        payload.profile_picture = profile.profileImage;
      }

      const token = await currentUser.getIdToken();
      const response = await api.put(`/profile/${currentUser.uid}/`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const updatedUser = {
        ...currentUser,
        ...payload,
        photoURL: profile.profileImage,
        is_profile_complete: true
      };

      if (setCurrentUser) {
        setCurrentUser(updatedUser);
      }

      localStorage.setItem('profileData', JSON.stringify(updatedUser));
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle styles
  const toggleStyles = `
    .toggle-checkbox:checked {
      right: 0;
      border-color: #f59e0b;
    }
    .toggle-checkbox:checked + .toggle-label {
      background-color: #f59e0b;
    }
  `;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{toggleStyles}</style>
      
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
                      {profile.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {editMode && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <label className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-lg font-medium cursor-pointer">
                          Change
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleProfileImageUpload}
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
                        required
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
                        required
                      />
                    ) : (
                      <p className="text-white">{profile.bio}</p>
                    )}
                  </div>

                  {currentUser?.userType === 'actor' && (
                    <div>
                      <label className="block text-gray-400 mb-1">Skills</label>
                      {editMode ? (
                        <div>
                          <input
                            type="text"
                            onKeyDown={handleSkillChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            placeholder="Type a skill and press Enter"
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                              >
                                {skill}
                                <button
                                  type="button"
                                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-yellow-600 hover:bg-yellow-200"
                                  onClick={() => removeSkill(index)}
                                >
                                  <span className="sr-only">Remove skill</span>
                                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                              <span key={index} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500">No skills added yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {currentUser?.userType === 'filmmaker' && (
                    <>
                      <div>
                        <label className="block text-gray-400 mb-1">Movies Done</label>
                        {editMode ? (
                          <input
                            type="number"
                            name="moviesDone"
                            value={profile.moviesDone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                            min="0"
                          />
                        ) : (
                          <p className="text-white">{profile.moviesDone}</p>
                        )}
                      </div>
                      <div className="flex items-center pt-2">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only"
                              name="lookingForCast"
                              checked={profile.lookingForCast}
                              onChange={(e) => {
                                handleInputChange({
                                  target: {
                                    name: 'lookingForCast',
                                    type: 'checkbox',
                                    checked: e.target.checked
                                  }
                                });
                              }}
                              disabled={!editMode}
                            />
                            <div className={`block w-14 h-8 rounded-full ${profile.lookingForCast ? 'bg-amber-500' : 'bg-gray-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${profile.lookingForCast ? 'transform translate-x-6' : ''}`}></div>
                          </div>
                          <div className="ml-3 text-gray-300 font-medium">
                            {profile.lookingForCast ? 'Currently looking for cast' : 'Not currently casting'}
                          </div>
                        </label>
                      </div>
                    </>
                  )}

                  {editMode && (
                    <div className="pt-4">
                      <button
                        onClick={saveChanges}
                        disabled={loading}
                        className={`bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-lg font-bold flex items-center ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reel Upload Card */}
          {currentUser?.userType === 'filmmaker' && (
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
                      {uploadProgress > 0 && uploadProgress < 100 ? (
                        <div className="text-center">
                          <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
                            <div 
                              className="bg-amber-500 h-2.5 rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-400">Uploading... {uploadProgress}%</p>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <Film className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                          <p className="text-gray-400">Reel preview would appear here</p>
                          <p className="text-sm text-gray-500 mt-2">{profile.reelDescription}</p>
                        </div>
                      )}
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
                          name="reelDescription"
                          value={profile.reelDescription}
                          onChange={handleInputChange}
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
          )}
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

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {profile.connections
                  .filter(conn => 
                    conn.name.toLowerCase().includes(newConnectionSearch.toLowerCase())
                  )
                  .map(connection => (
                    <div key={connection.id} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors duration-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={connection.avatar || '/default-avatar.png'} 
                            alt={connection.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-sm text-gray-400">{connection.status || 'Member'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-400 hover:text-amber-400"
                          onClick={() => navigate(`/profile/${connection.id}`)}
                        >
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
                {profile.connections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Connections className="w-10 h-10 mx-auto mb-3" />
                    <p>No connections yet</p>
                  </div>
                )}
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
                disabled={loading}
                className={`bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-2 rounded-lg font-bold flex items-center justify-center w-full ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
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