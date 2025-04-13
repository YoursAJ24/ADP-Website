import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bg.jpg';

function OrderwiseItem() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Get location state which includes `user_id`
  const location = useLocation();
  const { state } = location;
  const userId = state ? state.user_id : null;
  const cartId = state ? state.cart_id :null;

  const userString = localStorage.getItem('user');
  const userData = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);


  useEffect(() => {
    if (!token || (userData && userData.access !== 'bosslevel')) {
      navigate('/inventory');
      return; // Prevent further execution
    }

    const fetchItems = async () => {
      if (!userId) return;

      try {
        // Fetch items based on `userId`
        const response = await fetch(
          `https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/cart-items-user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        // Log data to verify structure
        console.log('Fetched items:', data);

        // Ensure data is in expected format and map it
        if (Array.isArray(data)) {
          setItems(
            data.map((item) => ({
              id: item._id,
              name: item.itemName,
              Tdemand: item.ordered_quantity,
              Tavail: item.allotted_quantity,
              addQuantity: '', // Initialize empty or default value
              status: item.status,
              remarks: item.remarks || '', // Default to empty if not provided
              link: item.link || '',
            }))
          );
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchItems();
  }, [userId]);

  const handleQuantityChange = (index, value) => {
    // Ensure value is an integer
    if (/^-?\d*$/.test(value)) {
      const updatedItems = [...items];
      updatedItems[index].addQuantity = value;
      setItems(updatedItems);
    }
  };

  const handleStatusChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].status = value;
    setItems(updatedItems);
  };

  const handleDelete = async (cart, itemName) => {
    try {
      // Make the DELETE request to the API
      const response = await fetch(
        `https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/remove-item/${cart}/${itemName}`,
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
        const updatedItems = items.filter(item => item.name !== itemName);
        setItems(updatedItems);
  
        // Optional: Notify the user of successful deletion
        console.log('Item successfully deleted:', data.message);
      } else {
        // Handle errors returned by the server
        console.error('Error deleting item:', data.error || data);
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error('Error making delete request:', error);
    }
  };
  
  

  const requestDelete = (cart, itemName) => {
    setItemToDelete({ cart, itemName }); // Store both cart and itemName
    setConfirmDeleteVisible(true);
  };
  

  const handleRemarkChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].remarks = value;
    setItems(updatedItems);
  };

  const handleSave = async () => {
    // Create an array of updated items
    const updatedItems = items
      .filter((item) => item.addQuantity || item.status || item.remarks) // Filter out items with no changes
      .map((item) => ({
        _id: item.id,
        allotted_quantity: item.addQuantity ? parseInt(item.addQuantity) : undefined,
        status: item.status,
        remarks: item.remarks,
      }))
      .filter((item) => item.allotted_quantity !== undefined || item.status || item.remarks); // Remove items with no changes

    if (updatedItems.length === 0) {
      alert('No changes to save.');
      return;
    }

    try {
      const response = await fetch(
        'https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/update-multiple-cart-items',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: updatedItems }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      console.log('Items saved:', updatedItems);
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div
      id='OrderwiseItem'
      className='bg-custom-light text-black dark:bg-custom-dark dark:text-white lg:px-32 px-5 py-20 min-h-screen flex flex-col items-center'
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className='text-4xl font-bold mb-6'>Orderwise Item Management</h1>

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
              <th className='py-2 px-4 border-b'>Item</th>
              <th className='py-2 px-4 border-b'>Items Required</th>
              <th className='py-2 px-4 border-b'>Given Quantity</th>
              <th className='py-2 px-4 border-b'>Add Quantity</th>
              <th className='py-2 px-4 border-b'>Status</th>
              <th className='py-2 px-4 border-b'>Remarks</th>
              <th className='py-2 px-4 border-b'>Link</th>
              <th className='py-2 px-4 border-b'>Manage</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                <td className='py-2 px-4 border-b'>{item.name}</td>
                <td className='py-2 px-4 border-b'>{item.Tdemand}</td>
                <td className='py-2 px-4 border-b'>{item.Tavail}</td>
                <td className='py-2 px-4 border-b'>
                  <input
                    type='number'
                    className='quantity-input'
                    value={item.addQuantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    placeholder='Enter Quantity'
                  />
                </td>
                <td className='py-2 px-4 border-b'>
                  <select
                    className='status-dropdown'
                    value={item.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                  >
                    <option value=''>Select Status</option>
                    <option value='Pending'>Pending</option>
                    <option value='Delivered'>Delivered</option>
                    <option value='Ready'>Ready for Pickup</option>
                    <option value='Rejected'>Rejected</option>
                    <option value='Amazon'>Amazon</option>
                  </select>
                </td>
                <td className='py-2 px-4 border-b'>
                  <input
                    type='text'
                    className='remarks-input'
                    value={item.remarks}
                    onChange={(e) => handleRemarkChange(index, e.target.value)}
                    placeholder='Enter Remarks'
                  />
                </td>
                <td className='py-2 px-4 border-b'>
                {item.link ? (
                  <a href={item.link} target='_blank' rel='noopener noreferrer' className='text-blue-500'>
                    View Link
                  </a>
                ) : (
                  <span>No Link</span>
                )}
              </td> 
              <td className='py-2 px-4 border-b'>
                <button
                  onClick={() => requestDelete(cartId, item.name)} // Pass both cart and itemName
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

      {/* Save Button */}
      <button
        onClick={handleSave}
        className='bg-green-500 text-white px-4 py-2 rounded mt-10'
      >
        Save Changes
      </button>

      {/* Modal for viewing order details */}
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
      <p className='text-center mb-4'>Are you sure you want to delete this item?</p>
      <div className='flex space-x-2'>
        <button
          onClick={() => {
            handleDelete(itemToDelete.cart, itemToDelete.itemName); // Use both cart and itemName
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



      {/* CSS for Glow Effect */}
      <style jsx='true'>{`
        .glow {
          box-shadow: 0 0 15px rgba(0, 123, 255, 0.6);
        }

        .status-dropdown {
          background-color: black; /* Set background color to black */
          color: white; /* White text for better contrast */
          border: none; /* Remove green border */
          padding: 8px;
          border-radius: 5px; /* Rounded corners */
        }

        .quantity-input,
        .remarks-input {
          background-color: rgba(0, 0, 0, 0.2);
          color: #fff;
          border: none;
          padding: 8px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}

export default OrderwiseItem;
