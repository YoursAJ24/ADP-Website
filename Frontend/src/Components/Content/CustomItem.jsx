import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import bgImage from '../../assets/bg.jpg'; // Ensure the correct path to your background image

function Inventory() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const location = useLocation();
  const { state } = location;
  const userId = state ? state.user_id : null;

  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (userData && userData.access !== 'bosslevel')) {
      navigate('/inventory');
      return; // Prevent further execution
    }

    const fetchItems = async () => {
      try {
        const response = await fetch(
          'https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/cart-item-summary-custom',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        console.log('Fetched items:', data);

        if (Array.isArray(data)) {
          // Map data to the format you want
          setItems(
            data.map((item) => ({
              id: item._id, // Ensure the _id is stored for updates
              name: item.itemName,
              orderedQuantity: item.ordered_quantity, // Default to 0 if undefined
              allottedQuantity: item.allotted_quantity, // Default to 0 if undefined
              status: item.status, // Ensure proper initial value
              remarks: item.remarks, // Initialize remarks (you can modify this later)
              link: item.link, // Initialize link
            }))
          );
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [userId]); // Added dependencies

  const handleStatusChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].status = value;
    setItems(updatedItems);
  };

  const handleRemarkChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].remarks = value;
    setItems(updatedItems);
  };

  const handleSave = async () => {
    // Create an array of updated items
    const updatedItems = items
      .filter((item) => item.status || item.remarks) // Filter out items with no changes
      .map((item) => ({
        _id: item.id,
        status: item.status,
        remarks: item.remarks,
      }))
      .filter((item) => item.status || item.remarks); // Remove items with no changes

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

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      items.map((item) => ({
        'Item Name': item.name,
        'Total Ordered Quantity': item.orderedQuantity,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

    XLSX.writeFile(wb, 'external_inventory_items.xlsx');
  };

  return (
    <div
      id='Inventory'
      className='bg-custom-light text-black dark:bg-custom-dark dark:text-white lg:px-32 px-5 py-20 min-h-screen flex flex-col items-center'
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className='text-4xl font-bold mb-6'>External Inventory Demand</h1>

      <div className='flex align-center justify-center w-full mb-8'>
        <Link to='/inventoryadp'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded mr-4'>
            Back to Home
          </button>
        </Link>

        <button onClick={handleDownloadExcel} className='bg-green-500 text-white px-4 py-2 rounded'>
          Download Excel
        </button>
      </div>

      <div className='overflow-hidden rounded-lg shadow-lg border border-blue-400 glow'>
        <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg'>
          <thead>
            <tr className='text-left'>
              <th className='py-2 px-4 border-b'>Item Name</th>
              <th className='py-2 px-4 border-b'>Ordered Quantity</th>
              <th className='py-2 px-4 border-b'>Allotted Quantity</th>
              <th className='py-2 px-4 border-b'>Status</th>
              <th className='py-2 px-4 border-b'>Remarks</th>
              <th className='py-2 px-4 border-b'>Link</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                <td className='py-2 px-4 border-b'>{item.name}</td>
                <td className='py-2 px-4 border-b'>{item.orderedQuantity}</td>
                <td className='py-2 px-4 border-b'>{item.allottedQuantity}</td>
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
    style={{
      border: '1px solid #555', // Lighter gray border for dark mode
      borderRadius: '4px', // Less rounded corners
      padding: '8px',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: 'black', // Dark background
      color: '#fff', // Light text color
    }}
    value={item.remarks}
    onChange={(e) => handleRemarkChange(index, e.target.value)}
    placeholder='Enter Remarks'
  />
</td>

                <td className='py-2 px-4 border-b'>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>
                      Link
                    </a>
                  ) : (
                    'No link'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className='bg-green-500 text-white px-4 py-2 rounded mt-8'
      >
        Save Changes
      </button>

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

      <style jsx='true'>{`
        .status-dropdown {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 3px 8px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .status-dropdown option {
          background-color: black;
          color: white;
        }

        .status-dropdown:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
        }

        .remarks-input {
          width: 100%;
          padding: 3px;
          border: none;
          border-radius: 9999px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
        }

        .remarks-input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
        }

        .glow {
          box-shadow: 0 0 20px rgba(63, 81, 181, 0.6);
        }
      `}</style>
    </div>
  );
}

export default Inventory;
