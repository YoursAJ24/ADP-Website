import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg.jpg';

function Order() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);


  const navigate = useNavigate();

  // Use useMemo to ensure userData and token are fetched only once
  const userData = useMemo(() => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }, []);

  const requestDelete = (cart_id) => {
    setItemToDelete({ cart_id }); // Store both cart and itemName
    setConfirmDeleteVisible(true);
  };

  const handleDelete = async (cart_id) => {
    try {
      // Make the DELETE request to the API
      const response = await fetch(
        `https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/remove-cart/${cart_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`, // Use your token for authorization
          },
        }
      );
  
      const data = await response.json(); // Get the response data
  
      if (response.ok) {
        // On success, filter out the deleted item from the local state
        const updatedItems = items.filter(item => item.cart_id !== cart_id);
        setItems(updatedItems);
  
        // Optional: Notify the user of successful deletion
        console.log('Cart successfully deleted:', data.message);
      } else {
        // Handle errors returned by the server
        console.error('Error deleting Cart:', data.error || data);
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error('Error making delete request:', error);
    }
  };

  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    // Redirect to /inventory if user is not logged in or not a boss
    if (!token || (userData && userData.access !== 'bosslevel')) {
      navigate('/inventory');
      return; // Prevent further execution
    }

    // Fetch cart items summary from the API
    const fetchCartItemsSummary = async () => {
      try {
        const response = await fetch('https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/get-club-list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        setItems(data.map((item) => ({
          clubName: item.clubName,
          cordName: item.cordName,
          contact: item.contact,
          cart_id: item.cart_id,
          user_id: item.user_id,
        })));
      } catch (error) {
        console.error('Error fetching cart items summary:', error);
      }
    };

    fetchCartItemsSummary(); // Fetch data only once when component mounts
  }, [token, userData, navigate]);

  const handleOrderClick = (user_id, cart_id) => {
    navigate('/orderwiseitem', { state: { user_id, cart_id} });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div
      id='Order'
      className='bg-custom-light text-black dark:bg-custom-dark dark:text-white lg:px-32 px-5 py-20 min-h-screen flex flex-col items-center'
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className='text-4xl font-bold mb-10'>Order Management</h1>

      {/* Button to link to /inventoryadp */}
      <Link to='/inventoryadp'>
        <button className='bg-blue-500 text-white px-4 py-2 rounded mb-10'>
          Back to Home
        </button>
      </Link>

      {/* Table with glow and rounded corners */}
      <div className='overflow-hidden rounded-lg shadow-lg border border-blue-400 glow'>
        <table className='min-w-full bg-white dark:bg-gray-800'>
          <thead>
            <tr className='text-left'>
              <th className='py-2 px-4 border-b'>Club Name</th>
              <th className='py-2 px-4 border-b'>Coordinator</th>
              <th className='py-2 px-4 border-b'>Contact</th>
              <th className='py-2 px-4 border-b'>Order</th>
              <th className='py-2 px-4 border-b'>Manage</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                <td className='py-2 px-4 border-b'>{item.clubName}</td>
                <td className='py-2 px-4 border-b'>{item.cordName}</td>
                <td className='py-2 px-4 border-b'>{item.contact}</td>
                <td
                  className='py-2 px-4 border-b cursor-pointer text-blue-500 hover:underline'
                  onClick={() => handleOrderClick(item.user_id, item.cart_id)}
                >
                  View Order
                </td>
                <td className='py-2 px-4 border-b'>
                <button
                  onClick={() => requestDelete(item.cart_id)}
                  className='text-red-500 text-2xl px-4 py-2'
                  title='Delete'
                >
                  &times; {/* Cross symbol for delete */}
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing order details (if needed) */}
      {modalVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow-lg w-1/3 relative'>
            <button
              onClick={closeModal}
              className='absolute top-2 right-2 text-gray-500 dark:text-gray-300 text-2xl'
            >
              &times;
            </button>
            <h2 className='text-xl font-semibold mb-4'>Order Details</h2>
            <p>{selectedOrder}</p>
            <button
              onClick={closeModal}
              className='bg-blue-500 text-white px-4 py-2 rounded mt-4'
            >
              Close
            </button>
          </div>
        </div>
      )}

{confirmDeleteVisible && (
  <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
    <div className='bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded-lg shadow-lg w-1/4 relative flex flex-col items-center'>
      <h2 className='text-lg font-semibold mb-2'>Confirm Delete</h2>
      <p className='text-center mb-4'>Are you sure you want to delete this cart?</p>
      <div className='flex space-x-2'>
        <button
          onClick={() => {
            handleDelete(itemToDelete.cart_id);
            setConfirmDeleteVisible(false);
          }}
          className='bg-red-500 text-white px-4 py-2 rounded'
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setConfirmDeleteVisible(false)}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <style jsx='true'>{`
        .glow {
          box-shadow: 0 0 15px rgba(0, 123, 255, 0.6);
        }
      `}</style>
    </div>
  );
}

export default Order;