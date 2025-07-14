import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RealTimeOrders = () => {
  const [orders, setOrders] = useState([]); // Real-time orders
  const [pendingOrders, setPendingOrders] = useState([]); // Pending orders
  const processedCartIds = useRef(new Set()); // To track processed cart IDs

  // Fetch cart data from the API
  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/v1/customer/carts"
      );
      const cartData = response.data.carts;

      if (Array.isArray(cartData)) {
        // Only show orders with status 'new'
        setOrders(cartData.filter((cart) => cart.status === 'new'));
      } else {
        console.error("API response does not contain an array of carts:", cartData);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error.message);
    }
  };

  useEffect(() => {
    fetchCartData(); // Fetch data initially
    const interval = setInterval(fetchCartData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Handle Accept action
  const handleAcceptClick = async (order) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/api/v1/customer/carts/accept/${order._id}`
      );
      if (response.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((o) => o._id !== order._id));
        toast.success(`Order accepted for ${order.user}!`);
      }
    } catch (error) {
      console.error("Error accepting order:", error.message);
      toast.error("Failed to accept order.");
    }
  };

  // Handle Decline action
  const handleDeclineClick = async (order) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/api/v1/customer/carts/decline/${order._id}`
      );
      if (response.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((o) => o._id !== order._id));
        toast.info(`Order declined for ${order.user}.`);
      }
    } catch (error) {
      console.error("Error declining order:", error.message);
      toast.error("Failed to decline order.");
    }
  };

  // Handle Done action
  const handleDoneClick = async (order) => {
    try {
      const response = await axios.delete(
        `http://localhost:3002/api/v1/customer/carts/move-to-history/${order._id}`
      );

      if (response.status === 200) {
        setPendingOrders((prevPendingOrders) =>
          prevPendingOrders.filter((o) => o._id !== order._id)
        );
        toast.success(`Order for ${order.user} marked as done!`);
      }
    } catch (error) {
      console.error("Error moving order to history:", error.message);
      toast.error("Failed to mark order as done.");
    }
  };

  // Handle Resend action
  const handleResendClick = (order) => {
    setPendingOrders((prevPendingOrders) =>
      prevPendingOrders.filter((o) => o._id !== order._id)
    );
    setOrders((prevOrders) => [...prevOrders, { ...order, status: "Real-Time" }]);
    toast.info(`Order for ${order.user} resent to real-time queue.`);
  };

  // Helper functions to calculate totals
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const calculateTotalQuantity = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Order card component
  const OrderCard = ({ order, actions }) => (
    <div className="flex flex-col bg-white p-3 rounded-lg shadow-md border border-gray-300">
      <div>
        <h2 className="text-lg font-semibold">{order.user}</h2>
        <p className="text-sm text-gray-600">Phone: {order.phoneNumber}</p>
      </div>
      {order.items.map((item, index) => (
        <p key={`${order._id}-${index}`} className="text-xs text-gray-500">
          {item.name}: {item.quantity}
        </p>
      ))}
      <p className="text-xs font-semibold mt-2">Total Quantity: {calculateTotalQuantity(order.items)}</p>
      <p className="text-xs font-semibold">Total Price: ₹{calculateTotalPrice(order.items)}</p>
      <div className="flex space-x-3 mt-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => action.onClick(order)}
            className={`px-3 py-1 rounded-lg text-white text-[10px] sm:text-xs ${action.className}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col sm:flex-row gap-6">
      {/* Toast Container */}
      <ToastContainer />

      {/* Real-Time Orders Section */}
      <div className="w-full sm:w-1/2 lg:w-2/5">
        <h1 className="text-xl md:text-2xl font-bold text-black mb-4">Real-Time Orders</h1>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                actions={[
                  {
                    label: "Accept",
                    onClick: handleAcceptClick,
                    className: "bg-blue-600 hover:bg-blue-700",
                  },
                  {
                    label: "Decline",
                    onClick: handleDeclineClick,
                    className: "bg-gray-600 hover:bg-gray-700",
                  },
                ]}
              />
            ))
          ) : (
            <p>No orders available.</p>
          )}
        </div>
      </div>

      {/* Pending Orders Section */}
      <div className="w-full sm:w-1/2 lg:w-2/5">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-4">Pending Orders</h2>
        <div className="space-y-4">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                actions={[
                  {
                    label: "Done",
                    onClick: handleDoneClick,
                    className: "bg-green-600 hover:bg-green-700",
                  },
                  {
                    label: "Resend",
                    onClick: handleResendClick,
                    className: "bg-yellow-600 hover:bg-yellow-700",
                  },
                ]}
              />
            ))
          ) : (
            <p>No pending orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeOrders;
