import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Modal from 'react-modal';
import img from '../../assets/snap2.jpeg';
import './Home.css';

Modal.setAppElement('#root');

function About() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = img;
    link.download = 'image.jpg';
    link.target = '_blank';
    link.click();
  };

  return (
    <div id='AboutUs' className='bg-custom-light text-black dark:bg-custom-dark dark:text-white lg:px-32 px-5 py-20 text-center gap-5 lg:text-start flex lg:flex-row flex-col justify-between lg:gap-20 items-center min-h-screen overflow-hidden'>
      <div className="top-transition"></div>
      <img
        data-aos='fade-down'
        src={img}
        alt="ADP Image"
        className='rounded-[35px] border-1 p-1 border-silver-500 img_glow cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:border-silver-300 w-full max-w-[400px] lg:max-w-[650px] h-auto'
        onClick={openModal}
      />
      <div className='h-full lg:py-20 flex flex-col justify-center lg:items-start items-center'>
        <h1 data-aos='fade-right' style={{ fontFamily: 'Anton', letterSpacing: 0.8 }} className='text-[32px] sm:text-[40px] md:text-[48px] lg:text-[60px] font-semibold mb-8 leading-normal text-silver-700 uppercase'>
          About ADP
        </h1>
        <p data-aos='fade-left' style={{ fontFamily: 'Poppins', letterSpacing: 0.8 }} className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] mb-8 leading-normal text-silver-700 max-w-[500px] lg:max-w-none">
          Who are we, you ask? We're the Department of Art, Design and Publicity.
          <br /><br />
          We are responsible for publicising our festivals: Oasis and APOGEE with promotional material, and adorning the campus with massive paintings and breathtaking structures alike.
          <br /><br />
          What we create lives in the memory of thousands of attendees for it gets etched in their memories for years to come. 
          <br /><br />
          Our exploration of different mediums of paintings; physical and digital, sculpting and graphic designing opens up a large avenue for all your budding interests.
        </p>
      </div>
      <div className="bottom-transition"></div>
    </div>
  );
  
}

export default About;
