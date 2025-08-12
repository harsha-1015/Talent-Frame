import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user type from backend
          const token = await user.getIdToken();
          const response = await api.get(`/user/${user.uid}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const userData = response.data;
          
          // Add user type to the user object
          user.userType = userData.user_type;
          user.is_profile_complete = userData.is_profile_complete;
        } catch (error) {
          console.error('Error fetching user data from backend:', error);
          // Default to actor if there's an error fetching user type
          user.userType = 'actor';
        }
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
