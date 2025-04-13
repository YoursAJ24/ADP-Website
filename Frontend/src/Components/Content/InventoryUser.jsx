import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/bg.jpg";
import inImage from "../../assets/product_inspection.png";
import { faStoreAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import { useOrderContext } from "./OrderContext";

function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [remarkToShow, setRemarkToShow] = useState(null);
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemLink, setNewItemLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isConfirmDisabled } = useOrderContext();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [confirmOrderVisible, setConfirmOrderVisible] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  // Fetch the user info from localStorage
  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem("token");
  // If token is not found, redirect to /inventory

  useEffect(() => {
    if (!token || userData.access !== "user") {
      // If no token found, redirect to inventory page
      navigate("/inventory");
    }
    setUser(userData);
  
    fetch(
      "https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/inventorys/inventory/user",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Sorting logic
        const sortedData = data.sort((a, b) => {
          if (a.itemName.startsWith("Brush Round")) return -1;
          if (b.itemName.startsWith("Brush Round")) return 1;

          if (a.itemName.startsWith("Brush Flat")) return -1;
          if (b.itemName.startsWith("Brush Flat")) return 1;
  
          if (a.itemName.startsWith("Paint (15 ml)")) return -1;
          if (b.itemName.startsWith("Paint (15 ml)")) return 1;
  
          if (a.itemName.startsWith("Paint (500 ml)")) return -1;
          if (b.itemName.startsWith("Paint (500 ml)")) return 1;
  
          return 0; // Other items remain in their default order
        });
  
        // Set sorted items
        setItems(
          sortedData.map((item) => ({
            id: item._id,
            name: item.itemName,
            quantity: 0,
          }))
        );
        setAllItems(
          sortedData.map((item) => ({
            id: item._id,
            name: item.itemName,
            quantity: 0,
          }))
        );
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);
  

  const handleQuantityChange = (index, value) => {
    const newQuantity = Math.max(0, Number(value));
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const incrementQuantity = (index) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (index) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
    );
  };

  const addToCart = (index) => {
    const item = items[index];
    if (item.quantity > 0) {
      setCart((prevCart) => {
        // Check if the item is already in the cart
        const existingItemIndex = prevCart.findIndex(
          (cartItem) => cartItem.item_id === item.id
        );
        if (existingItemIndex !== -1) {
          // Update quantity if item is already in the cart
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            ordered_quantity:
              updatedCart[existingItemIndex].ordered_quantity + item.quantity,
          };
          return updatedCart;
        } else {
          // Add new item to the cart with item name
          return [
            ...prevCart,
            {
              item_id: item.id,
              item_name: item.name,
              ordered_quantity: item.quantity,
            },
          ];
        }
      });
      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index ? { ...item, quantity: 0 } : item
        )
      );
      setNotification("Added to Cart");
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleAddNewItem = async () => {
    // Basic validation before sending request
    if (!newItemName || !newItemQuantity) {
      setErrorMessage("Item name and quantity are required.");
      return;
    }

    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.itemName === newItemName
      );
      if (existingItemIndex !== -1) {
        // Update quantity if item is already in the cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          ordered_quantity:
            updatedCart[existingItemIndex].ordered_quantity + newItemQuantity,
        };
        return updatedCart;
      } else {
        // Add new item to the cart with item name
        return [
          ...prevCart,
          {
            item_id: null,
            item_name: newItemName,
            ordered_quantity: newItemQuantity,
            link: newItemLink,
          },
        ];
      }
    });
    setNotification("Added to Cart");
    setTimeout(() => setNotification(""), 2000);

    // Clear the fields after a successful request
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemLink("");
    setErrorMessage("");

    // Close the dialog
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    setCart([]);
    setShowCart(false);
  };

  const handleOrder =() => {
    setConfirmOrderVisible(true);
  }

  const placeOrder = async () => {
    // Fetch the user info from localStorage
    const userString = localStorage.getItem("user");
    const userData = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem("token");
    setUser(userData);

    // Split cart items into two categories: those with item_id and those without
    const cartWithItemId = cart.filter((cartItem) => cartItem.item_id !== null);
    const cartWithoutItemId = cart.filter(
      (cartItem) => cartItem.item_id === null
    );

    // Format the cart items with item_id to match the required order format
    const formattedCart = cartWithItemId.map((cartItem) => ({
      item_id: cartItem.item_id,
      ordered_quantity: cartItem.ordered_quantity,
    }));

    try {
      // Proceed with placing order for items with item_id (original placeOrder logic)
      if (formattedCart.length > 0) {
        const response = await fetch(
          "https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/add-items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userData.id, // Using userData directly to avoid async issue with state
              items: formattedCart,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setNotification("Order Placed");
        setTimeout(() => setNotification(""), 2000);
      }

      // Now handle items without item_id (logic from handleAddNewItem)
      for (const newItem of cartWithoutItemId) {
        const response = await fetch(
          "https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/add-custom-item",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userData.id,
              itemName: newItem.item_name,
              ordered_quantity: newItem.ordered_quantity,
              link: newItem.link || "", // Assuming the link is optional
            }),
          }
        );

        const data = await response.json();
        if (response.status !== 200) {
          // Handle any errors from the backend
          setErrorMessage(
            data.errors
              ? data.errors.map((err) => err.msg).join(", ")
              : "Failed to add custom item"
          );
          continue;
        }
      }

      // Clear cart and close order modal after successful requests
      handleDelete();
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const fetchOrders = async () => {
    // Fetch the user info from localStorage
    const userString = localStorage.getItem("user");
    const userData = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem("token");
    setUser(userData); // Ensure setUser updates state properly

    // Optional: Log user and cart information for debugging
    console.log(
      JSON.stringify({
        userId: userData?.id,
      })
    );

    if (userData && userData.id) {
      try {
        const response = await fetch(
          `https://adp-backend-bzdrfdhvbhbngbgu.southindia-01.azurewebsites.net/api/cart/cart-items-final/${userData.id}`, // Corrected userData.id
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Only calling response.json() once
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
  };

  const toggleViewMode = () => {
    setIsGridView(!isGridView);
  };
 
  const Cartclear = () => {
    setConfirmDeleteVisible(true);
  }

  // Handler for search input
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredItems = allItems.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setItems(filteredItems);
  };


  const handleViewOrders = () => {
    if (!showOrders) {
      fetchOrders(); // Fetch orders only when the button is clicked to show the orders
    }
    setShowOrders(!showOrders); // Toggling showOrders state
  };

  <button
    onClick={handleViewOrders} // Single onClick handler
    className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded shadow-md hover:from-green-600 hover:to-green-800 transition duration-300"
  >
    {showOrders ? "Hide Orders" : "View Orders"}
  </button>;

  const handleLogoutAndRedirect = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/inventory");
  };

  return (
    <div
      id="Inventory"
      className="bg-custom-light text-black dark:bg-custom-dark dark:text-white px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-10 md:py-20 min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="top-transition"></div>
      <div className="w-full flex flex-col items-start mb-12 max-w-6xl">
        <div className="w-full flex flex-row justify-between items-center overflow-hidden">
          {/* Left side: Title and Welcome text */}
          <div className="flex flex-col items-start flex-1">
            <h1
              style={{
                fontFamily: "Anton",
                letterSpacing: 4,
                whiteSpace: "nowrap", // Prevent wrapping
              }}
              className="text-base md:text-3xl lg:text-4xl xl:text-6xl uppercase font-bold mb-2 text-silver-700 dark:text-silver-300 truncate"
            >
              Oasis Inventory Portal
            </h1>
            <h2
              style={{ fontFamily: "Anton", letterSpacing: 2 }}
              className="text-base md:text-lg lg:text-3xl xl:text-3xl font-semibold text-silver-600 dark:text-silver-400 pt-2"
            >
              Welcome {user?.clubName || "Guest"}!
            </h2>
          </div>
          {/* Right side: Image */}
          <div className="flex-shrink-0 ml-4">
            <img
              src={inImage}
              alt="description of the image"
              className="w-[80px] sm:w-[100px] md:w-[125px] lg:w-[150px] xl:w-[200px] h-auto object-cover"
            />
          </div>
        </div>



        <div className="flex flex-wrap justify-between mt-12 w-full space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Toggle View Mode */}
          <div className="flex items-center justify-center mb-4 sm:mb-0">
            <div
              className="relative w-48 h-16 border-2 border-white flex items-center rounded-md cursor-pointer p-1"
              onClick={toggleViewMode}
            >
              <div
                className={`absolute top-0 left-0 h-full w-1/2 rounded-md bg-[#390B31] transition-transform duration-300 ${
                  isGridView ? "translate-x-0" : "translate-x-full"
                }`}
              ></div>

              {/* Icon for grid view */}
              <div className="relative z-10 w-1/2 h-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faDice}
                  className={`text-white ${
                    isGridView ? "opacity-100" : "opacity-50"
                  }`}
                />
              </div>

              {/* Icon for list view */}
              <div className="relative z-10 w-1/2 h-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faList}
                  className={`text-white ${
                    isGridView ? "opacity-50" : "opacity-100"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Cart and Orders Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="bg-[#390B31] border-2 border-white h-16 text-2xl rounded-md text-white px-4 shadow-md transition duration-300 font-bold flex items-center justify-center w-full sm:w-auto p-2"
            >
              {showCart ? "Hide Cart" : "View Cart"}
              <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
            </button>

            <button
              onClick={handleViewOrders}
              className="bg-[#390B31] border-2 border-white h-16 text-2xl rounded-md text-white px-4 shadow-md transition duration-300 font-bold flex items-center justify-center w-full sm:w-auto p-2"
            >
              {showOrders ? "Hide Orders" : "Your Orders"}
              <FontAwesomeIcon icon={faStoreAlt} className="text-white ml-2" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogoutAndRedirect}
              className="bg-[#390B31] border-2 border-white h-16 text-2xl rounded-md text-white px-4 shadow-md transition duration-300 font-bold flex items-center justify-center w-full sm:w-auto p-2"
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="justify-center ml-2"
              />
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 z-50">
          {notification}
        </div>
      )}

      {showCart && (
        <div className="w-full max-w-6xl mt-6 p-4 bg-black/50 backdrop-blur-md shadow-lg border glow rounded-lg mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
            Cart Items
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full dark:bg-black rounded-lg">
              <thead
                style={{ backgroundColor: "#2A0C25" }}
                className="bg-gray-300 dark:bg-gray-700"
              >
                <tr>
                  <th className="py-4 px-2 sm:px-4 border-b text-xl uppercase text-left text-gray-700 dark:text-gray-300">
                    Item
                  </th>
                  <th className="py-2 px-2 sm:px-4 border-b text-xl uppercase text-center text-gray-700 dark:text-gray-300">
                    Quantity
                  </th>
                  <th className="py-2 px-2 sm:px-4 border-b text-xl uppercase text-center text-gray-700 dark:text-gray-300">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-4 px-4 text-center text-gray-600 dark:text-gray-300"
                    >
                      No items in cart
                    </td>
                  </tr>
                ) : (
                  cart.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="py-4 px-2 sm:px-4 text-xl border-b text-gray-600 dark:text-gray-100">
                        {item.item_name}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xl text-gray-600 dark:text-gray-100 text-center">
                        {item.ordered_quantity}
                      </td>
                      <td className="py-2 px-2 sm:px-4 border-b text-xl text-gray-600 dark:text-gray-100 text-center">
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 text-xl transition duration-200 transform hover:scale-110"
                        >
                          &#x2715; {/* Unicode for cross symbol */}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {cart.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between">
              <button
                onClick={handleOrder}
                className={`bg-[#390B31] text-white px-6 py-2 rounded shadow-md transition duration-300 hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 hover:shadow-lg ${
                  isConfirmDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isConfirmDisabled}
              >
                Confirm Order
              </button>
              <button
                onClick={Cartclear}
                className="bg-[#390B31] text-white mt-4 sm:mt-0 sm:ml-4 px-6 py-2 rounded shadow-md transition duration-300 hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 hover:shadow-lg"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      )}

      {showOrders && (
        <div className="w-full max-w-6xl mt-6 p-4 bg-black/30 backdrop-blur-md shadow-lg border glow rounded-lg mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">Your Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-black rounded-lg">
              <thead
                style={{ backgroundColor: "#2A0C25" }}
                className="bg-gray-300 dark:bg-gray-700"
              >
                <tr>
                  <th className="py-4 px-2 sm:px-4 border-b text-left text-xl uppercase text-gray-700 dark:text-gray-300">
                    Item
                  </th>
                  <th className="py-4 px-2 sm:px-4 border-b text-center text-xl uppercase text-gray-700 dark:text-gray-300">
                    Ordered Quantity
                  </th>
                  <th className="py-4 px-2 sm:px-4 border-b text-center text-xl uppercase text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="py-4 px-2 sm:px-4 border-b text-center text-xl uppercase text-gray-700 dark:text-gray-300">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 px-4 text-center text-gray-600 dark:text-gray-300"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={index}>
                      <td className="py-4 px-2 sm:px-4 border-b text-xl text-gray-800 dark:text-gray-100">
                        {order.itemName}
                      </td>
                      <td className="py-4 px-2 sm:px-4 border-b text-center text-xl text-gray-800 dark:text-gray-100">
                        {order.ordered_quantity}
                      </td>
                      <td className="py-4 px-2 sm:px-4 border-b text-center text-xl text-gray-800 dark:text-gray-100">
                        {order.status}
                      </td>
                      <td className="py-4 px-2 sm:px-4 border-b text-center text-xl text-gray-800 dark:text-gray-100">
                        {order.remarks ? (
                          <button
                            style={{ backgroundColor: "#390B31" }}
                            className="text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-300"
                            onClick={() => setRemarkToShow(order.remarks)}
                          >
                            View
                          </button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal to display the remark */}
          {remarkToShow && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-300 dark:border-gray-600 w-96 h-80 flex flex-col">
              <div className="flex-grow overflow-y-auto"> 
                <h4 className="text-2xl font-bold mb-4 text-center">Remark</h4>
                <p className="text-center mb-4">{remarkToShow}</p> {/* Displaying the remark content */}
              </div>
              <div className="flex justify-center mt-4"> 
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800 transition duration-300"
                  onClick={() => setRemarkToShow(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>          
          
          )}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black/50 backdrop-blur-lg border glow p-6 rounded-lg shadow-lg z-60 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            <input
              type="text"
              placeholder="Item Name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="mb-3 p-2 border rounded w-full text-black font-bold"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              className="mb-3 p-2 border rounded w-full text-black font-bold"
            />
            <input
              type="text"
              placeholder="Link for ordering (optional)"
              value={newItemLink}
              onChange={(e) => setNewItemLink(e.target.value)}
              className="mb-3 p-2 border rounded w-full text-black font-bold"
            />
            <div className="flex flex-col sm:flex-row justify-between">
              <button
                onClick={handleAddNewItem}
                style={{ backgroundColor: "#390B31" }}
                className="hover:bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 sm:mr-2"
              >
                Add Item
              </button>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


{confirmOrderVisible && (
  <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
    <div className='bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded-lg shadow-lg w-1/4 relative flex flex-col items-center'>
      <h2 className='text-lg font-semibold mb-2'>Confirm Order</h2>
      <p className='text-center mb-4'>Are you sure you want to order this item?</p>
      <div className='flex space-x-2'>
        <button
          onClick={() => {
            placeOrder();
            setConfirmOrderVisible(false);
          }}
          className='bg-red-500 text-white px-4 py-2 rounded'
        >
          Yes, Order
        </button>
        <button
          onClick={() => setConfirmOrderVisible(false)}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Cancel
        </button>
      </div>
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
            handleDelete();
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





      <div className="w-full max-w-6xl mt-6">
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search items by title"
            value={searchQuery}
            onChange={handleSearchChange}
            className="
              w-full max-w-md 
              p-3 mb-6 border border-gray-300 rounded-md 
              text-center text-black placeholder-gray-500
              transition-all duration-300 ease-in-out 
              focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent
              bg-white
            "
            style={{
              boxShadow: "inset 0px -6px 12px rgba(0, 0, 0, 0.2), inset 0px 6px 12px rgba(0, 0, 0, 0.1)", // Stronger bowl effect
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.5), inset 0px -6px 12px rgba(0, 0, 0, 0.2), inset 0px 6px 12px rgba(0, 0, 0, 0.1)")} // Glow effect on typing
            onBlur={(e) => (e.target.style.boxShadow = "inset 0px -6px 12px rgba(0, 0, 0, 0.2), inset 0px 6px 12px rgba(0, 0, 0, 0.1)")} // Revert to original when unfocused
          />
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No items available
          </p>
        ) : (
          <ul
            className={
              isGridView
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {items.map((item, index) => (
              <li
                key={item.id}
                className={`bg-black/50 backdrop-blur-lg flex items-center justify-between shadow-lg hover:shadow-[0_0_15px_5px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105 p-4 sm:p-6 rounded-lg ${
                  isGridView
                    ? "flex-col justify-between"
                    : "flex-row items-center justify-between space-x-4"
                } border border-gray-200`}
                style={
                  isGridView
                    ? {
                        minHeight: "200px",
                        maxHeight: "400px",
                        minwidth: "200px",
                        maxWidth: "400px",
                      }
                    : {
                        minHeight: "100px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: "100%",
                      }
                }
              >
                {/* Item Name */}
                <div
                  className={`flex-grow ${
                    isGridView ? "flex items-start justify-center" : "flex justify-start"
                  }`}
                  style={isGridView ? { minHeight: "60%" } : { width: "30%" }}
                 
                >
                  <h4
                    className={`text-2xl font-semibold ${
                      isGridView ? "text-center" : "text-left"
                    } leading-tight truncate`}

                    style={{
                      whiteSpace: "normal", // Allow wrapping
                      overflowWrap: "break-word", // Allow long words to break
                      wordBreak: "break-word", // Break words if necessary
                    }}
                    >
                  
                    {item.name}
                  </h4>
                </div>

                {/* Quantity Controls */}
                <div
                  className={`flex items-center justify-center bg-white rounded-xl space-x-2 sm:space-x-5 ${
                    isGridView ? "mb-2" : "flex-shrink-0"
                  }`}
                  style={
                    isGridView
                      ? {
                          minHeight: "20%",
                          width: "150px",
                          maxWidth: "100%",
                        }
                      : {
                          display: "flex",
                          alignItems: "center", // Center the quantity controls vertically
                          justifyContent: "center", // Center the quantity controls horizontally
                          width: "150px",
                          height: "40px",
                          marginLeft: window.innerWidth >= 1024 ? "-120px" : "15px", // Apply margin based on screen size
                        }
                  }
                >
                  <button
                    onClick={() => decrementQuantity(index)}
                    className="text-black font-bold text-3xl sm:text-2xl lg:text-xl px-2 py-1 rounded transition duration-200 transform hover:scale-105"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-12 sm:w-16 lg:w-12 font-semibold text-black text-3xl sm:text-2xl lg:text-xl text-center bg-black/0"
                  />
                  <button
                    onClick={() => incrementQuantity(index)}
                    className="text-black font-bold text-3xl sm:text-2xl lg:text-xl px-1 py-2 rounded transition duration-200 transform hover:scale-105"
                  >
                    +
                  </button>
                </div>


                {/* Add to Cart Button */}
                <div
                  className={`flex-grow ${
                    isGridView
                      ? "flex items-center justify-center"
                      : "flex justify-end"
                  }`}
                  style={
                    isGridView
                      ? {
                          minHeight: "20%",
                          width: "150px",
                          maxWidth: "100%",
                        }
                      : {
                          maxWidth: "100%",
                          display: "flex",
                          width: "150px",
                          height: "40px",
                          justifyContent: "right",
                        }
                  }
                >
                  <button
                    onClick={() => addToCart(index)}
                    style={{ backgroundColor: "#390B31" }}
                    className="text-white font-semibold text-xs sm:text-sm px-3 py-1 mt-2 rounded transition duration-200 transform hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </li>
            ))}
            <li
              key="add-item"
              className={`bg-black/50 backdrop-blur-lg shadow-lg hover:shadow-[0_0_15px_5px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105 p-4 sm:p-6 rounded-xl border border-gray-200 flex ${
                isGridView
                  ? "flex-col justify-center"
                  : "flex-row items-center justify-center space-x-4"
              }`}
              style={
                isGridView
                  ? {
                      minHeight: "200px",
                      maxHeight: "400px",
                      maxwidth: "200px",
                      maxWidth: "400px",
                    }
                  : {
                      minHeight: "100px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      maxWidth: "100%",
                    }
              }
            >
              <button
                onClick={toggleDialog}
                className="text-white font-bold text-6xl px-6"
              >
                +
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Inventory;
