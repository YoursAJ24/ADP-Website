import React, { useEffect } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import img from '../../assets/ADPLogoNewGrad_Transparent.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation } from 'react-router-dom';
import './Home.css'

function Home() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const scrollToSection = location.state?.scrollTo;
    if (scrollToSection) {
      document.getElementById(scrollToSection)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state]);

  const social = [
    {
      link: 'https://www.linkedin.com/company/department-of-art-design-and-publicity-bits-pilani/',
      icon: <FaLinkedinIn className="icon-glow text-silver-700 hover:text-silver-500" />,
    },
    {
      link: 'https://www.instagram.com/adp_bitspilani/',
      icon: <FaInstagram className="icon-glow text-silver-700 hover:text-silver-500" />,
    },
    {
      link: 'http://wasap.my/918000695988',
      icon: <FaWhatsapp className="icon-glow text-silver-700 hover:text-silver-500" />,
    },
  ];

  return (
    <div className="home-container">
      <div id="Home" className="bg-custom-light text-black dark:bg-custom-dark dark:text-white lg:px-40 md:px-24 px-10 py-20 text-center gap-5 lg:text-start flex lg:flex-row flex-col-reverse justify-between lg:gap-20 md:gap-16 items-center min-h-screen overflow-hidden">
      <div className="top-transition"></div>
        <div className="h-full lg:py-40 md:py-24 flex flex-col justify-center lg:items-start items-center">
          <h1
            data-aos="fade-right"
            style={{ fontFamily: 'Anton', letterSpacing: 0.8 }}
            className="text-[16px] sm:text-[18px] md:text-[24px] lg:text-[30px] font-bold  leading-normal uppercase"
          >
            Welcome To The Department of
            <br />
            <span className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[72px] font-bold leading-normal uppercase text-silver-700" style={{ fontFamily: 'Anton', letterSpacing: 0.8 }}>
              Art, Design and Publicity
            </span>
          </h1>
          <div data-aos="fade-up" className="flex mb-2 gap-2">
            <div className="flex items-center justify-center">
              <div className="flex space-x-2">
                {social.map((social, index) => (
                  <a
                    key={index}
                    target="_blank"
                    href={social.link}
                    className="hover:text-silver-500 rounded-full p-2"
                    
                  >
                    <div className="text-[24px] sm:text-[28px] md:text-[32px]" >
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p
            data-aos="fade-left"
            style={{ fontFamily: 'Poppins', letterSpacing: 0.8 }}
            className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] mb-8 leading-normal text-silver-700"
          >
            A collective of passionate artists, we are the visionaries behind the stunning aesthetics of Oasis and APOGEE, the grand cultural and technical fests of BITS Pilani. From breathtaking backdrops to mind-blowing structures, we craft the ambience that defines these iconic festivals. We are the architects of the visual narrative, infusing every corner with creativity and innovation. Beyond the artistic realm, we are the driving force behind the publicity of these flagship events. Our canvas is the stage, and our colors are imagination. We create more than just visuals; we craft experiences.
          </p>
          
        </div>
        <img
          data-aos="fade-up"
          src={img}
          alt="ADP Logo"
          className="rounded-full border-2 p-1 border-silver-700 img_glow w-[250px] sm:w-[300px] md:w-[300px] lg:w-[400px] xl:w-[500px] h-auto"
        />
      </div>
      <div className="bottom-transition"></div>
    </div>
  );
};

export default Home;

