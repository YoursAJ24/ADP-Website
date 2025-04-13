import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Home.css';

const Endpoint = () => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const description = query.get('description');

  // Import images based on the description
  const imageFolders = {
    'OASIS 2023': import.meta.glob('../../assets/OASIS/OASIS 2023/*.{jpg,jpeg,png}'),
    'OASIS 2022': import.meta.glob('../../assets/OASIS/OASIS 2022/*.{jpg,jpeg,png}'),
    'OASIS 2019': import.meta.glob('../../assets/OASIS/OASIS 2019/*.{jpg,jpeg,png}'),
    'OASIS 2018': import.meta.glob('../../assets/OASIS/OASIS 2018/*.{jpg,jpeg,png}'),
    'OASIS 2017': import.meta.glob('../../assets/OASIS/OASIS 2017/*.{jpg,jpeg,png}'),
    'OASIS 2016': import.meta.glob('../../assets/OASIS/OASIS 2016/*.{jpg,jpeg,png}'),
    'OASIS 2015': import.meta.glob('../../assets/OASIS/OASIS 2015/*.{jpg,jpeg,png}'),
    'OASIS 2014': import.meta.glob('../../assets/OASIS/OASIS 2014/*.{jpg,jpeg,png}'),
    'OASIS 2013': import.meta.glob('../../assets/OASIS/OASIS 2013/*.{jpg,jpeg,png}'),
    'OASIS 2012': import.meta.glob('../../assets/OASIS/OASIS 2012/*.{jpg,jpeg,png}'),
    'OASIS 2011': import.meta.glob('../../assets/OASIS/OASIS 2011/*.{jpg,jpeg,png}'),
    'OASIS 2010': import.meta.glob('../../assets/OASIS/OASIS 2010/*.{jpg,jpeg,png}'),
    'OASIS 2009': import.meta.glob('../../assets/OASIS/OASIS 2009/*.{jpg,jpeg,png}'),
    'OASIS 2008': import.meta.glob('../../assets/OASIS/OASIS 2008/*.{jpg,jpeg,png}'),
    'OASIS 2007': import.meta.glob('../../assets/OASIS/OASIS 2007/*.{jpg,jpeg,png}'),
    'OASIS 2006': import.meta.glob('../../assets/OASIS/OASIS 2006/*.{jpg,jpeg,png}'),
    'OASIS 2005': import.meta.glob('../../assets/OASIS/OASIS 2005/*.{jpg,jpeg,png}'),
    'OASIS 2004': import.meta.glob('../../assets/OASIS/OASIS 2004/*.{jpg,jpeg,png}'),
    'OASIS 2003': import.meta.glob('../../assets/OASIS/OASIS 2003/*.{jpg,jpeg,png}'),
    'OASIS 2002': import.meta.glob('../../assets/OASIS/OASIS 2002/*.{jpg,jpeg,png}'),
    'OASIS 2001': import.meta.glob('../../assets/OASIS/OASIS 2001/*.{jpg,jpeg,png}'),
    'OASIS 2000': import.meta.glob('../../assets/OASIS/OASIS 2000/*.{jpg,jpeg,png}'),
    'OASIS 1999': import.meta.glob('../../assets/OASIS/OASIS 1999/*.{jpg,jpeg,png}'),
    'OASIS 1998': import.meta.glob('../../assets/OASIS/OASIS 1998/*.{jpg,jpeg,png}'),
    'APOGEE 2024': import.meta.glob('../../assets/APOGEE/APOGEE 2024/*.{jpg,jpeg,png}'),
    'APOGEE 2023': import.meta.glob('../../assets/APOGEE/APOGEE 2023/*.{jpg,jpeg,png}'),
    'APOGEE 2022': import.meta.glob('../../assets/APOGEE/APOGEE 2022/*.{jpg,jpeg,png}'),
    'APOGEE 2021': import.meta.glob('../../assets/APOGEE/APOGEE 2021/*.{jpg,jpeg,png}'),
    'APOGEE 2020': import.meta.glob('../../assets/APOGEE/APOGEE 2020/*.{jpg,jpeg,png}'),
    'APOGEE 2019': import.meta.glob('../../assets/APOGEE/APOGEE 2019/*.{jpg,jpeg,png}'),
    'APOGEE 2018': import.meta.glob('../../assets/APOGEE/APOGEE 2018/*.{jpg,jpeg,png}'),
    'APOGEE 2017': import.meta.glob('../../assets/APOGEE/APOGEE 2017/*.{jpg,jpeg,png}'),
    'APOGEE 2016': import.meta.glob('../../assets/APOGEE/APOGEE 2016/*.{jpg,jpeg,png}'),
    'APOGEE 2015': import.meta.glob('../../assets/APOGEE/APOGEE 2015/*.{jpg,jpeg,png}'),
    'APOGEE 2014': import.meta.glob('../../assets/APOGEE/APOGEE 2014/*.{jpg,jpeg,png}'),
    'APOGEE 2013': import.meta.glob('../../assets/APOGEE/APOGEE 2013/*.{jpg,jpeg,png}'),
    'APOGEE 2012': import.meta.glob('../../assets/APOGEE/APOGEE 2012/*.{jpg,jpeg,png}'),
    'APOGEE 2011': import.meta.glob('../../assets/APOGEE/APOGEE 2011/*.{jpg,jpeg,png}'),
    'APOGEE 2010': import.meta.glob('../../assets/APOGEE/APOGEE 2010/*.{jpg,jpeg,png}'),
    'APOGEE 2009': import.meta.glob('../../assets/APOGEE/APOGEE 2009/*.{jpg,jpeg,png}'),
    'APOGEE 2008': import.meta.glob('../../assets/APOGEE/APOGEE 2008/*.{jpg,jpeg,png}'),
    'APOGEE 2007': import.meta.glob('../../assets/APOGEE/APOGEE 2007/*.{jpg,jpeg,png}'),
    'APOGEE 2006': import.meta.glob('../../assets/APOGEE/APOGEE 2006/*.{jpg,jpeg,png}'),
    'APOGEE 2005': import.meta.glob('../../assets/APOGEE/APOGEE 2005/*.{jpg,jpeg,png}'),
    'APOGEE 2004': import.meta.glob('../../assets/APOGEE/APOGEE 2004/*.{jpg,jpeg,png}'),
    'APOGEE 2003': import.meta.glob('../../assets/APOGEE/APOGEE 2003/*.{jpg,jpeg,png}'),
    'APOGEE 2002': import.meta.glob('../../assets/APOGEE/APOGEE 2002/*.{jpg,jpeg,png}'),
    'APOGEE 2001': import.meta.glob('../../assets/APOGEE/APOGEE 2001/*.{jpg,jpeg,png}'),
    'APOGEE 2000': import.meta.glob('../../assets/APOGEE/APOGEE 2000/*.{jpg,jpeg,png}')
  };

  useEffect(() => {
    const loadImages = async () => {
      const imageContext = imageFolders[description];

      if (imageContext) {
        const imageModules = await Promise.all(
          Object.values(imageContext).map((importFn) => importFn())
        );
        const loadedPhotos = imageModules.map((module) => module.default);
        setPhotos(loadedPhotos);
        setCurrentIndex(0); // Reset to the first image when loading new images
      }
    };
    const handleBackClick = () => {
      navigate(-1); // Go back to the previous page
    };
  

    loadImages();
    AOS.init({ duration: 1000 });
    window.scrollTo(0, 0);
  }, [description]);

  const handleNext = () => {
    if (photos.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
  };

  const handlePrev = () => {
    if (photos.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrev();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Calculate indices for previous and next images
  const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
  const nextIndex = (currentIndex + 1) % photos.length;

  return (
    <div id='slideshow' className='bg-custom-light text-black dark:bg-custom-dark dark:text-white p-4 sm:p-6 md:p-10 lg:p-20 flex flex-col items-center justify-center relative min-h-screen overflow-hidden'>
             
        {/* Heading */}
        <h1 data-aos='fade-right' style={{ fontFamily: 'Anton', letterSpacing: 0.8 }} className='text-3xl sm:text-4xl mb-12 md:text-5xl lg:text-6xl font-normal leading-normal uppercase text-silver-700 font-anton'>
          RELIVE THE MEMORIES
        </h1>
               
      <div className='relative w-full max-w-[1000px] flex items-center justify-center'>
        <button onClick={handlePrev} className='fixed left-4 top-1/2 transform -translate-y-1/2 text-white bg-black p-3 rounded-full z-20 text-3xl'>
          <FaArrowLeft />
        </button>
        <div className='flex flex-row items-center'>
        <div className='relative w-[20vw] h-[20vw] sm:w-[15vw] sm:h-[15vw] md:w-[12vw] md:h-[12vw] lg:w-[10vw] lg:h-[10vw] opacity-50 mx-4 sm:mx-6 md:mx-8' onClick={handlePrev}>
          {photos.length > 0 && (
            <img
              src={photos[prevIndex]}
              alt="Previous Photo"
              style={{ opacity: 0.6 }} // Adjust the value to the desired transparency
              className='absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg cursor-pointer'
            />
          )}
        </div>
          <div className='relative w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] md:w-[40vw] md:h-[40vw] lg:w-[30vw] lg:h-[30vw] '>
            {photos.length > 0 && (
              <img
                style={{
                  boxShadow: '0 0px 20px rgba(131, 90, 148, 0.676)',
                  filter: 'drop-shadow(0 0 10px rgba(131, 90, 148, 0.676))',
                }}
                className='img-end absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg'
                src={photos[currentIndex]}
                alt="Current Photo"
              />
            )}
          </div>
          <div className='relative w-[20vw] h-[20vw] sm:w-[15vw] sm:h-[15vw] md:w-[12vw] md:h-[12vw] lg:w-[10vw] lg:h-[10vw] opacity-50 mx-4 sm:mx-6 md:mx-8' onClick={handleNext}>
            {photos.length > 0 && (
              <img src={photos[nextIndex]} alt="Next Photo" className='absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg cursor-pointer' />
            )}
          </div>
        </div>
        <button onClick={handleNext} className='fixed right-4 top-1/2 transform -translate-y-1/2 text-white bg-black p-3 rounded-full z-20 text-3xl'>
          <FaArrowRight />
        </button>
      </div>
      <style jsx>{
        `@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');`
      }</style>
    </div>
  );
};

export default Endpoint;
