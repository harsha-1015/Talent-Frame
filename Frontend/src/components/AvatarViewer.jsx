import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function AvatarViewer() {
  const { uid } = useParams();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`avatar/get/${uid}/`);
        
        if (response.data && response.data.avatarUrl) {
          setAvatarUrl(response.data.avatarUrl);
        } else {
          setError('No avatar found for this user');
        }
      } catch (err) {
        console.error('Error fetching avatar:', err);
        setError('Failed to load avatar. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) {
      fetchAvatar();
    }
  }, [uid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="User Avatar" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/256?text=Avatar+Not+Found';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400">No avatar available</span>
          </div>
        )}
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold text-white">User Avatar</h2>
        {avatarUrl && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(avatarUrl);
              alert('Avatar URL copied to clipboard!');
            }}
            className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            Copy Avatar URL
          </button>
        )}
      </div>
    </div>
  );
}

export default AvatarViewer;