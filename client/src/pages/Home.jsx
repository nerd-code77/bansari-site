import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Note: Yahan apni Render wali asli link dalna mat bhulna
    axios.get('YOUR_RENDER_BACKEND_URL/api/posts').then(res => {
      setPosts(res.data);
    });
  }, []);

  // Filter data
  const heroSlides = posts.filter(p => p.category === 'hero-slider');
  
  // FIX 1: Variable name me space hataya (workUpdates)
  const workUpdates = posts.filter(p => p.category === 'work');

  const sliderSettings = {
    // FIX 2: slides.ToShow se dot hataya
    dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true
  };

  return (
    <div className="font-sans text-gray-800">
      
      {/* 1. Hero Section with Slider */}
      <section className="h-[80vh] w-full overflow-hidden relative bg-gray-900">
        <Slider {...sliderSettings}>
          {heroSlides.map(slide => (
            <div key={slide._id} className="relative h-[80vh]">
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
                <h1 className="text-5xl font-bold uppercase tracking-wider border-b-4 border-orange-500 pb-2">{slide.title}</h1>
                <p className="text-xl mt-4 font-light">{slide.description}</p>
              </div>
            </div>
          ))}
        </Slider>
        
        {/* Static Overlay if no slides */}
        {heroSlides.length === 0 && (
           <div className="h-full flex flex-col justify-center items-center text-white">
              <h1 className="text-6xl font-bold text-orange-500">BANSARI DATT</h1>
              <p className="text-2xl mt-2">Voice of SAL Institute</p>
           </div>
        )}
      </section>

      {/* 2. About Us Section */}
      <section className="py-20 px-6 bg-white flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto">
        <div className="md:w-1/2">
            {/* Note: Ensure this image exists in public folder */}
            <img src="/bansari-profile.jpg" alt="Bansari Datt" className="rounded-lg shadow-2xl border-l-8 border-orange-500" />
        </div>
        <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Meet Bansari Datt</h2>
            <h3 className="text-xl text-orange-600 font-semibold mb-4">B.Tech Student | SAL Institute | Leader</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
                Namaste! Main Bansari Datt hoon. Mera mission hai SAL Institute ke students ki aawaz banna. 
                Chahe academic issues hon ya cultural activities, main hamesha aapke sath khadi hoon.
                Aane wale election mein aapka saath chahiye badlaav ke liye.
            </p>
            <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition">
                Join the Movement
            </button>
        </div>
      </section>

      {/* 3. My Work / Activity Feed (Sliders) */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">My Recent Activities & Meetings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* FIX 3: Correct variable name used here */}
                {workUpdates.map(work => (
                    <div key={work._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                        <div className="h-64 overflow-hidden">
                            <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover hover:scale-110 transition duration-500"/>
                        </div>
                        <div className="p-6">
                            <span className="text-xs font-bold text-orange-500 uppercase">Activity</span>
                            <h3 className="text-xl font-bold mt-2">{work.title}</h3>
                            <p className="text-gray-500 mt-2 text-sm">{work.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-6">
          <p>© 2024 Bansari Datt - Student Leader. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;