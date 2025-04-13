import React, { createContext, useState, useContext } from 'react';

// Create the context
const OrderContext = createContext();

// Custom hook for easier use of the context
export const useOrderContext = () => useContext(OrderContext);

// Provider component to wrap around the app
export const OrderProvider = ({ children }) => {
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(false);

  return (
    <OrderContext.Provider value={{ isConfirmDisabled, setIsConfirmDisabled }}>
      {children}
    </OrderContext.Provider>
  );
};
