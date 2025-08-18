import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Users, Film, Star, Clapperboard, Camera, Sparkles } from 'lucide-react';
import preview from "../assets/preview.png";

const Home = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      title: "AI Casting Vision",
      description: "Our neural networks analyze thousands of facial features to find your perfect match."
    },
    {
      icon: <Camera className="w-8 h-8 text-amber-400" />,
      title: "Virtual Screen Tests",
      description: "Preview actors in simulated scenes with our virtual audition system."
    },
    {
      icon: <Film className="w-8 h-8 text-amber-400" />,
      title: "Cinematic Database",
      description: "Access professional profiles with reel footage, headshots, and performance metrics."
    },
    {
      icon: <Clapperboard className="w-8 h-8 text-amber-400" />,
      title: "Director's Toolkit",
      description: "Save character concepts, create mood boards, and manage casting sessions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Film Grain Effect */}
      <section className="relative overflow-hidden bg-black">
        {/* Film grain overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjA1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wMiIvPgo8L3N2Zz4=')] opacity-10 pointer-events-none"></div>
        
        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12 py-36 md:py-44 relative z-1">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 flex justify-center"
            >
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1 inline-flex items-center">
                <span className="text-amber-400 text-sm font-medium">NOW CASTING</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-white to-white"
            >
              <span className="block">The Future of</span>
              <span className="block">Film Casting</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
            >
              AI-powered talent matching that brings your vision to life faster than ever before.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/character"
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Begin Casting Session</span>
                <Clapperboard className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              </Link>
              <Link
                to="/match"
                className="border border-white/20 hover:border-amber-400/50 hover:text-amber-400 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 group"
              >
                <span className="flex items-center space-x-2">
                  <span>View Demo Reel</span>
                  <Film className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Animated spotlight effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-400/5 blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section - Movie Credits Style */}
      <section className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
        {/* Film strip effect */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(to_right,black_0px,black_20px,white_20px,white_40px)] opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(to_right,black_0px,black_20px,white_20px,white_40px)] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-white">Director's</span>{" "}
              <span className="text-white">Toolkit</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-400 max-w-3xl mx-auto text-lg"
            >
              Everything you need to cast your next production, powered by cutting-edge AI technology.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-amber-400/30 p-8 rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/20 rounded-lg flex items-center justify-center group-hover:bg-amber-400/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section - Movie Set Style */}
      <section className="relative py-28 bg-black overflow-hidden">
        {/* Film projector light effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="mb-6">
                <span className="text-amber-400 font-mono text-sm tracking-widest">VIRTUAL CASTING</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-white">Design.</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Preview.</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-amber-400">Cast.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Our virtual character builder lets you visualize your perfect cast before you even hold auditions. 
                Adjust facial features, expressions, and even simulate lighting conditions.
              </p>
              <Link
                to="/character"
                className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-3 rounded-lg font-bold transition-all duration-300 group"
              >
                <span>Launch Character Studio</span>
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              {/* 3D character builder with preview image */}
              <div className="relative aspect-video bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={preview} 
                    alt="Character Builder Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* UI elements overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="bg-black/50 border border-gray-700 rounded-full px-3 py-1 text-xs text-gray-300">Facial Sculpting Mode</div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <Star className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating UI elements for cinematic effect */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-amber-400/30 rounded-lg rotate-12"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 border-2 border-blue-400/30 rounded-lg rotate-6"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Movie Premiere Style */}
      <section className="relative py-32 bg-gradient-to-br from-gray-950 to-gray-900 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{ 
              opacity: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              opacity: [0, 0.3, 0],
              y: `+=${Math.random() * 100 - 50}`,
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <Clapperboard className="w-16 h-16 mx-auto text-amber-400" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-8"
          >
            Ready for Your <span className="text-amber-400">Close-up?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-12"
          >
            Join visionary directors who are reinventing the casting process with TalentFrame.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/character"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
            >
              <span>Start Free Trial</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
            <Link
              to="/match"
              className="border border-white/20 hover:border-amber-400/50 hover:text-amber-400 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 group shadow-lg shadow-black/20 hover:shadow-amber-400/10"
            >
              <span className="flex items-center space-x-2">
                <span>Schedule Demo</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;