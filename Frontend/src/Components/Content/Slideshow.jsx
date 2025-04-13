import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import OASIS from '../../All_Lists/OASIS';
import APOGEE from '../../All_Lists/APOGEE';
import { FaArrowLeft } from 'react-icons/fa'; // Import the back arrow icon

const Slideshow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const description = query.get('description');
  let fests;

  if (description === 'OASIS') {
    fests = OASIS;
  } else if (description === 'APOGEE') {
    fests = APOGEE;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Determine the heading text based on the description
  const headingText = description === 'APOGEE' ? 'Apogee Through The Years' : 'Oasis Through The Years';
  const content = description === 'OASIS'
    ? 'Oasis, a vibrant 4-day cultural festival, shines as the hallmark of the odd semester, sometime in October-November. With each passing year, Oasis expands its reach, drawing participants from top colleges across India. Oasis\' creations in its four verticals is fueled by the energy and enthusiasm of new recruits, which has continually elevated department-wide motivation for years together!'
    : 'APOGEE, a 3-day technical extravaganza, is held in late March/early April in the (conventionally unforgiving) even semester. With every coming year, APOGEE has taken strides to be one of India\'s top technical college festivals. For ADP members, it often scripts the coming-of-age stories of several second and third-yearites, with most of them learning what leadership and motivation is supposed to mean!';

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div id='slideshow' className="slideshow bg-custom-light text-black dark:bg-custom-dark dark:text-white p-4 sm:p-6 md:p-10 lg:p-20 flex flex-col items-center justify-center relative min-h-screen overflow-hidden">
      {/* Back button and heading in a flex container */}
      <div className="flex items-center mb-12 justify-between w-full">
      {/* Back button */}
        <div onClick={handleBackClick} className="back-button cursor-pointer ">
          <FaArrowLeft className="text-silver-700 hover:text-silver-500 transition duration-300" size={32} />
        </div>
        
        <h1 style={{ fontFamily: 'Anton', letterSpacing: 0.8 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-center justify-center">
          {headingText}
        </h1>

        <div className='flex items-center mb-12'/>
      </div>

      <p style={{ fontFamily: 'Poppins', letterSpacing: 0.8 }} className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 text-center">
        {content}
      </p>

      <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-24 sm:gap-x-26 md:gap-x-28 gap-y-6 mt-10'>
        {fests.map((tech, index) => (
          <div key={index} data-aos={tech.id % 2 === 0 ? 'fade-down' : 'fade-up'} className='flex flex-col items-center'>
            <Link to={`${tech.link}?description=${tech.description}`}>
              <div className='text-silver-800 rounded-2xl border-2 border-silver-700 shadow-silver-glow-strong p-0 flex items-center justify-center h-48 w-64 sm:w-72 md:w-80 lg:w-96 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-silver-glow'>
                <img className='h-full w-full object-cover rounded-2xl' src={tech.image} alt={tech.title} />
              </div>
            </Link>
            <h2 style={{ fontFamily: 'Poppins', letterSpacing: 0.8 }} className='text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] font-semibold mt-4 mb-0 text-center text-silver-700'>{tech.title}</h2>
            <p style={{ fontFamily: 'Poppins', letterSpacing: 0.8 }} className='text-sm sm:text-base md:text-lg lg:text-xl font-regular text-center text-silver-500 mb-5'>{tech.subtitle}</p> {/* Subtitle added here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
