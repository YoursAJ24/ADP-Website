import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Header/Navbar';
import Home from './Components/Content/Home';
import About from './Components/Content/About';
import TechStack from './Components/Content/TechStack';
import Projects from './Components/Content/Projects';
import Contact from './Components/Content/Contact';
import Footer from './Components/Footer/Footer';
import Slideshow from './Components/Content/Slideshow';
import { BallTriangle } from 'react-loader-spinner';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Endpoint from './Components/Content/endpoint';
import Treedesign from './Components/Content/Treedesign';
import Inventory from './Components/Content/Inventory'; 
import Orders from './Components/Content/Orders'; 
import InventoryUser from './Components/Content/InventoryUser';
import InventoryADP from './Components/Content/InventoryADP';// Import the Inventory component
import Login from './Components/Content/Login';
import Register from './Components/Content/Register';
import Items from './Components/Content/Items';
import CustomItem from './Components/Content/CustomItem'
import OrderwiseItem from './Components/Content/OrderwiseItem';
import Forgpass from './Components/Content/Forgpass';
import { OrderProvider } from './Components/Content/OrderContext';

import './App.css';

function App() {
  const [loading, setLoading] = useState(false);

  // For loading screen
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <OrderProvider>
    <Router>
      {loading ? (
        <div className="bg-black min-h-screen flex flex-grow justify-center items-center">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#BABABB"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <Routes>
          <Route path="/slideshow" element={
            <>
              <Navbar />
              <Slideshow />
              <Footer />
            </>
          } />
          <Route path="/endpoint" element={
            <>
              <Navbar />
              <Endpoint />
              <Footer />
            </>
          } />
          <Route path="/treedesign" element={
            <>
              <Navbar />
              <Treedesign />
              <Footer />
            </>
          } />
          <Route path="/inventory" element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          } />
          <Route path="/register" element={
            <>
              <Navbar />
              <Register />
              <Footer />
            </>
          } />
            <Route path="/forgpass" element={
            <>
              <Navbar />
              <Forgpass />
              <Footer />
            </>
          } />
          <Route path="/inventoryuser" element={
            <>
              <Navbar />
              <InventoryUser />
              <Footer />
            </>
          } />
          <Route path="/inventoryadp" element={
            <>
              <Navbar />
              <InventoryADP />
              <Footer />
            </>
          } />
          <Route path="/items" element={
            <>
              <Navbar />
              <Items />
              <Footer />
            </>
          } />
          <Route path="/customitems" element={
            <>
              <Navbar />
              <CustomItem />
              <Footer />
            </>
          } />
          <Route path="/orderwiseitem" element={
            <>
              <Navbar />
              <OrderwiseItem />
              <Footer />
            </>
          } />
          <Route path="/orders" element={
            <>
              <Navbar />
              <Orders />
              <Footer />
            </>
          } />
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <About />
              <Projects />
              <TechStack />
              <Contact />
              <Footer />
              <Analytics />
              <SpeedInsights />
            </>
          } />
        </Routes>
      )}
    </Router>
    </OrderProvider>
  );
}

export default App;
