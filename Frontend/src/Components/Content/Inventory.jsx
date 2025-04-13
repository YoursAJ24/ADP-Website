import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg.jpg'; 
import { FaArrowLeft } from 'react-icons/fa'; // Import the back arrow icon

function Inventory() {
  const navigate = useNavigate();
  const handleBackClick = () => {
   navigate('/')
  };

  return (
    <div className='bg-custom-light text-black dark:bg-custom-dark dark:text-white lg:px-32 px-5 py-10 min-h-screen flex flex-col items-center justify-start'   style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat' 
    }}>
      <div className="flex items-center justify-between w-full mt-24">

<div onClick={handleBackClick} className="back-button cursor-pointer">
  <FaArrowLeft className="text-silver-700 hover:text-silver-500 transition duration-300" size={32} />
</div>

<h1 style={{ fontFamily: 'Anton', letterSpacing: 0.8 }} className='text-[32px] sm:text-[40px] md:text-[48px] lg:text-[60px] font-semibold mb-0 leading-normal text-silver-700 uppercase'>
  inventory management
</h1>

<div className='flex items-center mb-0'/>
</div>

      <div className='flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 mt-20'>
        <button
          onClick={() => navigate('/inventoryadp')}
          className='bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 transform hover:scale-105 min-w-[200px] text-center'
        >
          ADP Login
        </button>
        <button
          onClick={() => navigate('/inventoryuser')}
          className='bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg shadow-lg hover:from-green-700 hover:to-green-900 transition duration-300 transform hover:scale-105 min-w-[200px] text-center'
        >
          Club Coordinator Login
        </button>
      </div>
    </div>
  );
}

export default Inventory;
