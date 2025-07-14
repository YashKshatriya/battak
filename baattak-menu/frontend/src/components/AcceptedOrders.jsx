import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusColors = {
  accepted: 'text-green-600',
  declined: 'text-red-600',
  new: 'text-yellow-600',
  completed: 'text-blue-600',
};

const statusLabels = {
  accepted: 'Accepted',
  declined: 'Rejected',
  new: 'Pending',
  completed: 'Completed',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Only filter by phone number for broader match
  const phoneNumber = localStorage.getItem('phoneNumber') || '';

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [phoneNumber]);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3002';
      // Fetch both current cart orders and order histories
      const [cartsRes, historyRes] = await Promise.all([
        axios.get(`${backendUrl}/api/v1/customer/carts`),
        axios.get(`${backendUrl}/api/v1/customer/orderHistories`),
      ]);
      const cartOrders = (cartsRes.data.carts || []).filter(
        (order) => order.phoneNumber === phoneNumber
      );
      const historyOrders = (historyRes.data || []).filter(
        (order) => order.phoneNumber === phoneNumber
      );
      // Add a status property to history orders if not present
      const normalizedHistory = historyOrders.map(order => ({
        ...order,
        status: order.status || 'completed',
      }));
      setOrders([...cartOrders, ...normalizedHistory]);
    } catch (err) {
      setError('Failed to fetch your orders.');
    }
    setLoading(false);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setDeletingId(orderId);
    try {
      const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || 'http://localhost:3002';
      await axios.delete(`${backendUrl}/api/v1/customer/carts/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      alert('Failed to delete order.');
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">My Orders</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 bg-white shadow relative flex flex-col min-h-[220px]">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">Order ID:</span> {order._id}
              <span className={`font-bold ${statusColors[order.status] || 'text-gray-600'}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {order.user}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Phone:</span> {order.phoneNumber}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Items:</span>
              <ul className="list-disc ml-6">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} x {item.quantity} (₹{item.price})</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Quantity:</span> {order.totalQuantity}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Price:</span> ₹{order.totalPrice}
            </div>
            <div className="flex-1" />
            <div className="flex justify-end mt-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                onClick={() => handleDelete(order._id)}
                disabled={deletingId === order._id}
              >
                {deletingId === order._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders; 