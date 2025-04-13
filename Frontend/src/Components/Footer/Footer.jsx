import React from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import '../Content/Home.css';

function Footer() {

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
        <footer id='' className='bg-customNav text-white border-t border-indigo-900 p-5 lg:px-48 flex justify-between'>
          <div className='flex flex-col md:flex-row gap-10'>
            <div>
              <h2 className='text-[24px] font-normal text-silver-700 py-2 uppercase' style={{ fontFamily: 'Anton', letterSpacing: '0.7px' }}>
                Contact
              </h2>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=adp@bits-oasis.org`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Poppins' }} className='text-[12px] hover:text-silver-700 transition-all duration-150 ease-in-out cursor-pointer'>
                <b>Email</b>: adp@bits-oasis.org
              </a>
              <br />
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=adp@bits-apogee.org`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Poppins' }} className='text-[12px] hover:text-silver-700 transition-all duration-150 ease-in-out cursor-pointer'>
                <b>Email</b>: adp@bits-apogee.org
              </a>
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-10'>
            <div>
              <h2 className='text-[24px] font-normal text-silver-700 py-2 uppercase' style={{ fontFamily: 'Anton', letterSpacing: '0.7px' }}>
                Connect With Us On
              </h2>
              <div className='flex space-x-4'>
                {social.map((item, index) => (
                  <a key={index} target="_blank" rel="noopener noreferrer" href={item.link} className='hover:text-silver-700 transition-all duration-150 ease-in-out'>
                    <div className='text-[28px]'>
                      {item.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      );
};

export default Footer;
