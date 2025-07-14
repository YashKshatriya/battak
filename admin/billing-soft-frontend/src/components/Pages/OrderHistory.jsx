import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order histories from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/v1/customer/orderHistories"
        );
        setOrders(response.data); // Assuming response data is an array
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) =>
    order.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Exporting orders...");
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Order History</h2>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by customer"
            className="p-2 border border-gray-300 rounded w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={handleExport}
            className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-900"
          >
            Export
          </button>
        </div>
      </div>

      <div className="order-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id} // Use the MongoDB `_id` as a unique key
            className="order-card border p-4 rounded shadow-md bg-white"
          >
            <h3 className="text-lg font-semibold mb-2">Order #{order._id}</h3>
            <p>
              <strong>Customer:</strong> {order.user}
            </p>
            <p>
              <strong>Phone:</strong> {order.phoneNumber}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Items:</strong>{" "}
              {order.items.map((item) => `${item.name} (${item.quantity})`).join(", ")}
            </p>
            <p>
              <strong>Total Quantity:</strong> {order.totalQuantity}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{order.totalPrice.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> <span className={`status-completed`}>completed</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
