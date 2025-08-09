import React, { useState } from 'react';
import { Search, Plus, MessageCircle, User, X, ChevronRight, Film, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';

function Connections() {
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      role: 'Director', 
      status: 'Connected', 
      avatar: null,
      projects: ['The Midnight Project', 'Shadows of Time'],
      expertise: 'Visual Storytelling'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      role: 'Producer', 
      status: 'Pending', 
      avatar: null,
      projects: ['City Lights', 'The Last Act'],
      expertise: 'Budget Management'
    },
    { 
      id: 3, 
      name: 'Michael Johnson', 
      role: 'Cinematographer', 
      status: 'Connected', 
      avatar: null,
      projects: ['Golden Hour', 'Neon Dreams'],
      expertise: 'Lighting Design'
    },
    { 
      id: 4, 
      name: 'Sarah Williams', 
      role: 'Editor', 
      status: 'Connected', 
      avatar: null,
      projects: ['Parallel Cuts', 'The Silent Edit'],
      expertise: 'Non-linear Storytelling'
    },
    { 
      id: 5, 
      name: 'David Brown', 
      role: 'Actor', 
      status: 'Connected', 
      avatar: null,
      projects: ['Method', 'Stage Lights'],
      expertise: 'Character Development'
    },
  ]);

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.expertise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeConnection = (id) => {
    setConnections(connections.filter(connection => connection.id !== id));
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Cinematic Background Element */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>
        <div className="absolute inset-0 bg-film-strip-pattern opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-gray-700"
        >
          {/* Header with Film Strip Design */}
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6 border-b border-amber-400/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-30"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clapperboard className="h-8 w-8 text-amber-400" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                  Talent Network
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-amber-400/10 text-amber-400 rounded-full text-sm font-medium">
                  {connections.length} Professionals
                </span>
              </div>
            </div>
          </div>

          {/* Search and Add - Cinematic Style */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-amber-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search directors, actors, cinematographers..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/20"
              >
                <Plus className="h-5 w-5 mr-2" />
                <span className="font-medium">Add Collaborator</span>
              </motion.button>
            </div>
          </div>

          {/* Stats - Film Reel Inspired */}
          <div className="px-6 py-4 border-b border-gray-700 bg-gray-900/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Film className="h-5 w-5 text-amber-400" />
                  <span className="text-gray-300">
                    <span className="text-amber-400 font-medium">{connections.length}</span> Total
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-300">
                    <span className="text-green-400 font-medium">
                      {connections.filter(c => c.status === 'Connected').length}
                    </span> Active
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <span className="text-gray-300">
                    <span className="text-amber-400 font-medium">
                      {connections.filter(c => c.status === 'Pending').length}
                    </span> Pending
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Sort by:</span>
                <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500">
                  <option>Recently Added</option>
                  <option>Name</option>
                  <option>Role</option>
                </select>
              </div>
            </div>
          </div>

          {/* Connections List - Movie Credit Style */}
          <div className="divide-y divide-gray-700">
            {filteredConnections.length > 0 ? (
              filteredConnections.map((connection) => (
                <motion.div 
                  key={connection.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-5 hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 relative">
                        {connection.avatar ? (
                          <img 
                            className="h-14 w-14 rounded-full border-2 border-amber-400/30 object-cover" 
                            src={connection.avatar} 
                            alt={connection.name} 
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-gray-700 border-2 border-amber-400/30 flex items-center justify-center">
                            <User className="h-6 w-6 text-amber-400" />
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-gray-800 ${
                          connection.status === 'Connected' ? 'bg-green-400' : 'bg-amber-400'
                        }`}></div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-medium text-white group-hover:text-amber-300 transition-colors duration-200">
                          {connection.name}
                          <span className="ml-2 text-sm font-normal bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded">
                            {connection.role}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-400">
                          <span className="font-medium text-amber-400/80">{connection.expertise}</span>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {connection.projects.map((project, index) => (
                            <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                              {project}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        className="p-2 text-gray-400 hover:text-amber-400 rounded-full hover:bg-gray-600 transition-colors duration-200"
                        title="Send message"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-600 transition-colors duration-200"
                        onClick={() => removeConnection(connection.id)}
                        title="Remove connection"
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                        title="View profile"
                      >
                        <span className="text-sm font-medium">Profile</span>
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-16 text-center"
              >
                <Film className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No collaborators found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm ? 'Try a different search term' : 'Your professional network will appear here'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Pagination - Film Reel Style */}
          <div className="px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/30">
            <div className="text-sm text-gray-400">
              Showing <span className="text-white">{filteredConnections.length}</span> of{' '}
              <span className="text-white">{connections.length}</span> professionals
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-amber-400 rounded-lg hover:bg-amber-400/10 transition-colors duration-200 flex items-center"
                disabled
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                Previous
              </motion.button>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center ${
                      page === 1 
                        ? 'bg-amber-400 text-gray-900 font-medium' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <motion.button 
                whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-amber-400 rounded-lg hover:bg-amber-400/10 transition-colors duration-200 flex items-center"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Connections;