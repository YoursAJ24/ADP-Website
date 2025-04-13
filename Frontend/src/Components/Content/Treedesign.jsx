import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation } from 'react-router-dom';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import oasisheads from '../../All_Lists/oasisheads';
import apogeeheads from '../../All_Lists/apogeeheads';
import Img1 from '../../assets/OCircle.png'; // Import the IMG1
import Img2 from '../../assets/Acircle.png'; // Import the IMG2

const glowBorderStyle = {
  position: 'absolute',
  display: 'inline-block',
  width: '4rem',
  height: '4rem',
  borderRadius: '50%'
};

const glowBorderBefore = {
  content: "''",
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)', // White glow effect
  pointerEvents: 'none'
};

const Treedesign = () => {
  const [heads, setHeads] = useState([]);
  const location = useLocation();
  const [isOasis, setIsOasis] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    window.scrollTo(0, 0);

    const query = new URLSearchParams(location.search);
    const description = query.get('param');

    if (description === 'stuccan') {
      setHeads(oasisheads);
      setIsOasis(true);
    } else {
      setHeads(apogeeheads);
      setIsOasis(false);
    }
  }, [location.search]);

  return (
    <div id="tree" className="relative bg-custom-light text-black dark:bg-custom-dark dark:text-white p-4 sm:p-6 md:p-10 lg:p-20 flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <h1 style={{ fontFamily: 'Anton', letterSpacing: 0.8 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center">
        {location.search.includes('stuccan') ? "Our StuCCAn's over the years..." : "Our CoStAAn's over the years..."}
      </h1>

      <VerticalTimeline>
        {heads.map((head, index) => (
          <VerticalTimelineElement
            key={index}
            className="vertical-timeline-element"
            contentStyle={{ background: 'transparent', color: '#fff', padding: '1rem', boxSizing: 'border-box' }} // Adjust padding for mobile
            contentArrowStyle={{ borderRight: '7px solid #000' }} // Black arrow
            date={head.date}
            iconStyle={{ background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Black icon background and centering
            icon={
              <div style={glowBorderStyle}> {/* Defined size and rounded */}
                <div style={glowBorderBefore} />
                <a href={head.linkedinProfile} target="_blank" rel="noopener noreferrer">
                  <img
                    src={isOasis ? Img1 : Img2}
                    alt="Icon"
                    className="w-full h-full object-cover rounded-full" // Ensure it covers the container
                  />
                </a>
              </div>
            } // Conditional icon image with overflow hidden
            data-aos="fade-up" // AOS fade-in effect
            data-aos-delay={index * 100} // Stagger the animations
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div className="flex-shrink-0">
                <a href={head.linkedinProfile} target="_blank" rel="noopener noreferrer">
                  <img
                    src={head.image}
                    alt={head.title}
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 max-w-full object-cover rounded-full border-4 border-gray-600 shadow-lg"
                    style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}
                  />
                </a>
              </div>
              <div className="flex-1 text-left sm:ml-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">{head.title}</h3>
                <h4 className="text-base sm:text-lg md:text-xl mb-2">{head.subtitle}</h4>
                <p className="text-sm sm:text-base md:text-lg">{head.description}</p>
              </div>
            </div>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  );
};

export default Treedesign;
