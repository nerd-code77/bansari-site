import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRocket, FaUsers, FaLightbulb, FaArrowRight, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('https://bansari-site.vercel.app/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroSlides = posts.filter(p => p.category === 'hero-slider');
  const workUpdates = posts.filter(p => p.category === 'work');

  // Auto-advance slides
  useEffect(() => {
    if (heroSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden bg-white">
      
      {/* Hero Section */}
      <section className="h-screen w-full overflow-hidden relative bg-gray-900">
        <AnimatePresence mode="wait">
          {heroSlides.length > 0 ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              className="relative h-screen"
            >
              <motion.div
                style={{ y: scrollY * 0.3 }}
                className="absolute inset-0"
              >
                <img 
                  src={heroSlides[currentSlide].imageUrl} 
                  alt={heroSlides[currentSlide].title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-orange-900/80" />
              </motion.div>

              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 z-10">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
                  className="backdrop-blur-lg bg-white/10 p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl max-w-4xl"
                >
                  <motion.h1 
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-7xl font-black uppercase tracking-widest mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"
                  >
                    {heroSlides[currentSlide].title}
                  </motion.h1>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="h-1 w-32 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mb-6"
                  />
                  <motion.p 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-lg md:text-2xl font-light max-w-2xl"
                  >
                    {heroSlides[currentSlide].description}
                  </motion.p>
                </motion.div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <FaChevronLeft className="text-white text-xl md:text-2xl" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <FaChevronRight className="text-white text-xl md:text-2xl" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all ${
                      idx === currentSlide 
                        ? 'w-12 h-3 bg-white' 
                        : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                    } rounded-full`}
                  />
                ))}
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/40 rounded-full"
                    style={{
                      left: `${10 + i * 12}%`,
                      top: `${20 + (i % 3) * 25}%`
                    }}
                    animate={{
                      y: [0, -120, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="h-screen flex flex-col justify-center items-center text-white bg-gradient-to-br from-blue-900 via-purple-900 to-orange-900">
              <motion.h1 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 1 }}
                className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-4"
              >
                BANSARI DATT
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl mt-4 font-light"
              >
                Voice of SAL Institute
              </motion.p>
            </div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white z-20"
        >
          <div className="w-7 h-11 border-2 border-white rounded-full flex justify-center p-2">
            <motion.div 
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-2 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-16 md:py-24 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white relative overflow-hidden"
      >
        {/* Animated Background Shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { icon: FaRocket, label: 'Projects', value: '50+', delay: 0 },
            { icon: FaUsers, label: 'Students Inspired', value: '1000+', delay: 0.2 },
            { icon: FaLightbulb, label: 'Innovations', value: '25+', delay: 0.4 }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ scale: 1.08, y: -8 }}
              className="text-center backdrop-blur-md bg-white/10 p-8 md:p-10 rounded-3xl border border-white/20 shadow-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: stat.delay, type: 'spring' }}
              >
                <stat.icon className="text-5xl md:text-7xl mx-auto mb-4" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: stat.delay + 0.3 }}
                className="text-4xl md:text-6xl font-black mb-2"
              >
                {stat.value}
              </motion.h3>
              <p className="text-lg md:text-xl font-light">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 md:py-28 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 relative overflow-hidden"
      >
        <div className="absolute top-20 right-10 md:right-20 w-48 md:w-96 h-48 md:h-96 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 md:left-20 w-64 md:w-[500px] h-64 md:h-[500px] bg-blue-300/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <motion.div 
            variants={scaleIn}
            className="md:w-1/2 w-full"
          >
            <div className="relative group max-w-md mx-auto">
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative overflow-hidden rounded-3xl shadow-2xl"
              >
                <img 
                  src="/bansari-profile.jpg" 
                  alt="Bansari Datt" 
                  className="w-full rounded-3xl border-8 border-white shadow-2xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x800/f97316/ffffff?text=Bansari+Datt';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -bottom-6 -right-4 md:-right-8 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 md:px-8 py-3 md:py-5 rounded-2xl shadow-2xl"
              >
                <p className="text-lg md:text-2xl font-bold">⭐ Top Researcher</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="md:w-1/2 w-full space-y-6"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="h-1 w-24 bg-gradient-to-r from-orange-500 to-pink-500"
            />
            
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-900">
              Meet Bansari Datt
            </h2>
            
            <h3 className="text-xl md:text-2xl text-orange-600 font-bold flex items-center gap-2">
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block w-3 h-3 bg-orange-500 rounded-full"
              />
              B.Tech Student | SAL Institute | Researcher
            </h3>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-md bg-white/70 p-6 md:p-8 rounded-2xl border border-white/40 shadow-xl"
            >
              <FaQuoteLeft className="text-3xl md:text-4xl text-orange-500 mb-4" />
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                Namaste! I am Bansari Datt. My journey at SAL Institute is defined by a passion for research and academic excellence.
                I believe in bridging the gap between theoretical knowledge and practical innovation.
                I am dedicated to fostering a culture where technology meets creativity,
                working alongside students to push boundaries in our field.
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-bold text-base md:text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Join the Movement
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Work Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 md:py-28 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-20">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              className="h-1 w-24 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mb-6"
            />
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-900 mb-4">
              My Recent Activities
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the latest projects, meetings, and innovations shaping the future
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {workUpdates.map((work, idx) => (
              <motion.div
                key={work._id}
                variants={fadeInUp}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <motion.img 
                    src={work.imageUrl} 
                    alt={work.title}
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  >
                    {idx + 1}
                  </motion.div>
                </div>

                <div className="p-5 md:p-6 relative">
                  <motion.span 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    className="inline-block px-4 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-xs font-bold uppercase rounded-full mb-3"
                  >
                    Activity
                  </motion.span>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-300">
                    {work.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {work.description}
                  </p>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 text-orange-500 font-semibold cursor-pointer"
                  >
                    Read More 
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight />
                    </motion.div>
                  </motion.div>

                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-100 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {workUpdates.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📚</div>
              <p className="text-2xl text-gray-400 font-semibold">No activities yet. Stay tuned!</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-16 md:py-28 bg-gradient-to-r from-blue-900 via-purple-900 to-orange-900 text-white text-center relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-72 md:w-[500px] h-72 md:h-[500px] bg-pink-500/20 rounded-full blur-3xl"
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-6xl font-black mb-6"
          >
            Let's Build the Future Together
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl mb-10 font-light"
          >
            Join me in revolutionizing education and technology
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-900 px-10 md:px-14 py-4 md:py-6 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:shadow-3xl transition-all"
          >
            Get In Touch
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex justify-center gap-4 md:gap-6 mb-6"
          >
            {['L', 'T', 'I', 'G'].map((letter, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold cursor-pointer shadow-lg"
              >
                {letter}
              </motion.div>
            ))}
          </motion.div>
          <p className="text-gray-400 text-sm md:text-base">© 2024 Bansari Datt - Student Leader. All Rights Reserved.</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">Crafted with ❤️ and Innovation</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;