import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import DevsList from '../../All_Lists/DevsList';

function Developers() {
  // For animation of the content in a component
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleImageClick = (linkedin) => {
    window.open(linkedin, "_blank");
  };

  return (
    <div id='TheDevelopers' className='bg-custom-light text-black dark:bg-custom-dark dark:text-white p-10 md:p-20 flex flex-col items-center justify-center w-full min-h-screen overflow-hidden'>
      <div className="top-transition"></div>
      <h1 data-aos='fade-right' style={{ fontFamily: 'Anton', letterSpacing: 0.8 }} className='text-[32px] sm:text-[40px] md:text-[48px] lg:text-[60px] font-semibold mb-8 leading-normal text-silver-700 uppercase'>
        The Developers
      </h1>
      <p data-aos='fade-left' style={{ fontFamily: 'Poppins', letterSpacing: 0.8 }}
         className='text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] mb-20 text-center opacity-0 transition-opacity duration-1000 ease-in-out'>
        Meet the passionate and dedicated developers who make up our incredible team.
      </p>
      
      <div className='flex flex-col items-center'>
        <div className='flex flex-row flex-wrap gap-6 justify-center'>
          {DevsList.slice(0, 6).map((tech, index) => (
            <div 
              key={index} 
              data-aos={index % 2 === 0 ? 'flip-left' : 'flip-right'} 
              className='flex flex-col items-center'
            >
              <div 
                className='text-silver-800 rounded-3xl border-2 border-silver-700 shadow-silver-glow-strong p-0 flex items-center justify-center h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] md:h-[200px] md:w-[200px] cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-silver-glow' 
                onClick={() => handleImageClick(tech.linkedin)}
              >
                <img className='h-full w-full object-cover rounded-3xl' src={tech.image} alt="" />
              </div>
              <h2 style={{ fontFamily: 'Poppins', letterSpacing: 0.1 }} className='text-[12px] sm:text-[16px] md:text-[20px] font-semibold mt-3 text-center text-silver-700'>{tech.title}</h2>
              <h3 style={{ fontFamily: 'Poppins', letterSpacing: 0.1 }} className='text-[8px] sm:text-[12px] md:text-[16px] font-medium text-center text-silver-500'>{tech.subtitle}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-transition"></div>
    </div>
  );
}

export default Developers;