import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProjectsList from '../../All_Lists/ProjectsList';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Projects() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSlideshowClick = (e) => {
    e.stopPropagation();
    console.log("Slideshow button clicked");
    navigate('/endpoint');
  };

  return (
    <div>
      <style>
        {`
          .shadow-silver-glow {
            box-shadow: 0 0 10px 5px rgba(192, 192, 192, 0.5);
          }

          .shadow-silver-glow-strong {
            box-shadow: 0 0 10px 5px rgba(192, 192, 192, 0.75);
          }

          .shadow-silver-glow-stronger {
            box-shadow: 0 0 30px 15px rgba(192, 192, 192, 0.75);
          }

          .group-hover-container:hover .hover-scale-shadow {
            transform: scale(1.05);
            box-shadow: 0 0 30px 15px rgba(192, 192, 192, 0.75);
          }

          .group-hover-container:hover .hover-scale {
            transform: scale(1.05);
          }
        `}
      </style>

      <div
        id="OurProjects"
        className="bg-custom-light text-black dark:bg-custom-dark dark:text-white p-10 md:p-20 flex flex-col items-center justify-center relative w-full min-h-screen overflow-hidden"
      >
        <div className="top-transition"></div>

        <h1 data-aos='fade-right' style={{ fontFamily: 'Anton', letterSpacing: 0.8 }} className='text-[32px] sm:text-[40px] md:text-[48px] lg:text-[60px] font-semibold mb-8 leading-normal text-silver-700 uppercase'>
          Our Projects
        </h1>

        <div className='flex flex-col md:flex-row flex-wrap gap-10 justify-center items-center w-full'>
          {ProjectsList.slice(0, 2).map((project) => (
            <div key={project.id} data-aos={project.id % 2 === 0 ? 'fade-down' : 'fade-up'} className='flex flex-col items-center group group-hover-container'>
              <Link to={`${project.link}?description=${project.description}`}>
                <div className='relative h-[200px] w-[300px] sm:h-[300px] sm:w-[400px] md:h-[400px] md:w-[500px] overflow-hidden rounded-3xl border-2 border-silver-700 shadow-silver-glow-strong group-hover:border-silver-500 transition-all duration-300 hover-scale-shadow'>
                  <img className='absolute inset-0 object-cover w-full h-full transform transition-transform duration-300 hover-scale' src={project.image} alt="project" />
                  <div className='absolute inset-0 border-2 border-silver-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-silver-glow'></div>
                </div>
                <p style={{ fontFamily: 'Poppins' }} className='flex gap-2 h-full mt-4 justify-center text-silver-700 text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px] font-semibold text-center cursor-pointer'>
                  {project.title}
                </p>
              </Link>
              <div className='flex gap-4 mt-2'>
                <a href={project.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className='text-silver-700 hover:text-silver-500 transition duration-300' size={30} md:size={24} />
                </a>
                <a href={project.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className='text-silver-700 hover:text-silver-500 transition duration-300' size={30} md:size={24} />
                </a>
                <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className='text-silver-700 hover:text-silver-500 transition duration-300' size={30} md:size={24} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="bottom-transition"></div>
      </div>
    </div>
  );
}

export default Projects;