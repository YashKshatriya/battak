import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, Users } from 'lucide-react';

const formatCurrency = (value) => {
  return value ? `₹${parseFloat(value).toLocaleString()}` : '₹0';
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: null,
    totalOrders: null,
    newCustomerCount: null,
    avgOrderValue: null,
    recentOrders: [],
    popularItems: [],
  });
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'http://localhost:3002/api/v1/customer'; // Set base URL here

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch multiple data points simultaneously using axios
        const [
          revenueRes,
          ordersRes,
          customerCountRes,
          avgOrderValueRes,
          recentOrdersRes,
          popularItemsRes
        ] = await Promise.all([
          axios.get(`${BASE_URL}/today-revenue`),
          axios.get(`${BASE_URL}/total-orders`),
          axios.get(`${BASE_URL}/usercount`),
          axios.get(`${BASE_URL}/avg-order-value-inweek`),
          axios.get(`${BASE_URL}/recent-orders-today`),
          axios.get(`${BASE_URL}/popular-items`),
        ]);
  
        // Ensure correct handling of data
        setDashboardData({
          totalRevenue: revenueRes.data?.totalRevenueToday ?? 0,
          totalOrders: ordersRes.data?.totalOrders ?? 0,
          newCustomerCount: customerCountRes.data?.count ?? 0,
          avgOrderValue: avgOrderValueRes.data?.avgOrderValueLastWeek ?? 0,
          recentOrders: recentOrdersRes.data ?? [], // Assuming response is an array of orders
          popularItems: popularItemsRes.data ?? [], // Assuming response is an array of items
        });
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [BASE_URL]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          icon={<DollarSign className="text-green-600" />}
          title="Today's Revenue"
          value={loading ? 'Loading...' : formatCurrency(dashboardData.totalRevenue)}
        />
        <DashboardCard
          icon={<ShoppingBag className="text-blue-600" />}
          title="Total Orders"
          value={loading ? 'Loading...' : dashboardData.totalOrders}
        />
        <DashboardCard
          icon={<Users className="text-purple-600" />}
          title="New Customers"
          value={loading ? 'Loading...' : dashboardData.newCustomerCount}
        />
        <DashboardCard
          icon={<DollarSign className="text-orange-600" />}
          title="Avg. Order Value"
          value={loading ? 'Loading...' : formatCurrency(dashboardData.avgOrderValue)}
        />
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={dashboardData.recentOrders} formatCurrency={formatCurrency} />
        <PopularItems items={dashboardData.popularItems} formatCurrency={formatCurrency} />
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
    </div>
    <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const RecentOrders = ({ orders, formatCurrency }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
    <div className="space-y-4">
      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map((order, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-medium">{order.user}</p> {/* Display customer name */}
              <p className="text-sm text-gray-500">{order.items.length} items • {formatCurrency(order.totalPrice)}</p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-green-50 text-green-600">
              {order.status}
            </span>
          </div>
        ))
      ) : (
        <p>No recent orders</p>
      )}
    </div>
  </div>
);

const PopularItems = ({ items, formatCurrency }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h2>
    <div className="space-y-4">
      {Array.isArray(items) && items.length > 0 ? (
        items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.quantity} orders</p>
            </div>
            <span className="font-semibold text-gray-700">{formatCurrency(item.totalRevenue)}</span>
          </div>
        ))
      ) : (
        <p>No popular items</p>
      )}
    </div>
  </div>
);

export default Dashboard;
