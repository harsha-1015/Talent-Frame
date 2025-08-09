import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, User, Film, Phone, Mail, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Match = () => {
  // Mock data - in a real app this would come from props or API
  const characterAvatar = "https://models.readyplayer.me/example-avatar.png";
  const matches = [
    {
      id: 1,
      name: "Alex Rivera",
      matchScore: 92,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Los Angeles, CA",
      skills: ["Method Acting", "Martial Arts", "Bilingual"],
      reel: "#",
      phone: "+1 (555) 123-4567",
      email: "alex.rivera@example.com"
    },
    {
      id: 2,
      name: "Sophie Chen",
      matchScore: 88,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      location: "New York, NY",
      skills: ["Improvisation", "Dancing", "Accents"],
      reel: "#",
      phone: "+1 (555) 987-6543",
      email: "sophie.chen@example.com"
    },
    {
      id: 3,
      name: "James Okafor",
      matchScore: 85,
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      location: "Atlanta, GA",
      skills: ["Stunt Work", "Singing", "Comedy"],
      reel: "#",
      phone: "+1 (555) 456-7890",
      email: "james.okafor@example.com"
    },
    {
      id: 4,
      name: "Maya Patel",
      matchScore: 83,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      location: "Vancouver, BC",
      skills: ["Voice Acting", "Motion Capture", "Archery"],
      reel: "#",
      phone: "+1 (555) 234-5678",
      email: "maya.patel@example.com"
    },
    {
      id: 5,
      name: "Ethan Zhang",
      matchScore: 80,
      image: "https://randomuser.me/api/portraits/men/81.jpg",
      location: "London, UK",
      skills: ["Parkour", "Sword Fighting", "Dialect Coaching"],
      reel: "#",
      phone: "+44 20 7946 0958",
      email: "ethan.zhang@example.com"
    },
    {
      id: 6,
      name: "Isabella Morales",
      matchScore: 78,
      image: "https://randomuser.me/api/portraits/women/92.jpg",
      location: "Chicago, IL",
      skills: ["Stage Combat", "Singing", "Animal Handling"],
      reel: "#",
      phone: "+1 (555) 345-6789",
      email: "isabella.morales@example.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8"
          >
            <div>
              <Link
                to="/character"
                className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Character
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300">
                  Matching Results
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                Actors best matching your created character
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center">
              <div className="mr-4 flex-shrink-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-amber-400/30">
                  <img 
                    src={characterAvatar} 
                    alt="Character Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Searching for:</p>
                <p className="text-lg font-medium text-amber-400">Main Character</p>
                <p className="text-sm text-gray-400">{matches.length} matches found</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters/Sorting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div className="mb-4 md:mb-0">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Filter by:</h3>
            <div className="flex flex-wrap gap-2">
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300">
                <option>Match Score</option>
                <option>90%+</option>
                <option>80%+</option>
                <option>70%+</option>
              </select>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300">
                <option>Location</option>
                <option>North America</option>
                <option>Europe</option>
                <option>Asia</option>
              </select>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300">
                <option>Skills</option>
                <option>Martial Arts</option>
                <option>Singing</option>
                <option>Dancing</option>
              </select>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Sort by:</h3>
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300">
              <option>Highest Match</option>
              <option>Most Experienced</option>
              <option>Recently Added</option>
            </select>
          </div>
        </motion.div>

        {/* Matches Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matches.map((actor) => (
            <motion.div
              key={actor.id}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-amber-400/50 transition-all duration-300 shadow-lg"
            >
              {/* Actor Header */}
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-950">
                  <img 
                    src={actor.image} 
                    alt={actor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-bold text-white">{actor.name}</h2>
                      <p className="text-sm text-gray-300">{actor.location}</p>
                    </div>
                    <div className="flex items-center bg-amber-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      <Star className="w-4 h-4 mr-1" />
                      {actor.matchScore}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Actor Details */}
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {actor.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4">
                  <div className="flex justify-between">
                    <a 
                      href={actor.reel} 
                      className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center"
                    >
                      <Film className="w-4 h-4 mr-2" />
                      View Reel
                    </a>
                    <div className="flex space-x-3">
                      <a 
                        href={`tel:${actor.phone}`} 
                        className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
                        title="Call"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                      <a 
                        href={`mailto:${actor.email}`} 
                        className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
                        title="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-300">
                    Contact
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <nav className="flex items-center space-x-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors duration-300">
              &lt;
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-500 text-gray-900 font-bold">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors duration-300">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors duration-300">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors duration-300">
              8
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors duration-300">
              &gt;
            </button>
          </nav>
        </motion.div>
      </div>
    </div>
  );
};

export default Match;