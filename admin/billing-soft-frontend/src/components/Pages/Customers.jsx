import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Search, X, User, Mail, Phone } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const defaultFormData = { username: '', email: '', phoneNumber: '' };
  const [formData, setFormData] = useState(defaultFormData);

  // Fetch customers from API using axios
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/v1/customer/all');
      setCustomers(response.data); // Set the fetched customers data
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        // If we are editing an existing customer, make a PUT request
        await axios.put(
          `http://localhost:3002/api/v1/customer/edit/${editingCustomer._id}`,
          formData
        );
        toast.success('Customer updated successfully!');
      } else {
        // If we are adding a new customer, make a POST request
        await axios.post('http://localhost:3002/api/v1/customer/register', formData);
        toast.success('Customer added successfully!');
      }

      await fetchCustomers(); // Re-fetch the customer list after add or update
      handleCloseModal(); // Close modal after add or update
    } catch (error) {
      console.error('Error adding or updating customer:', error);
      toast.error('Failed to add or update customer.');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer); // Set the customer to edit
    setFormData({
      username: customer.username,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
    });
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async () => {
    try {
      if (!showDeleteConfirm) return;
      const id = showDeleteConfirm; // Get the customer id from delete confirmation
      await axios.delete(
        `http://localhost:3002/api/v1/customer/delete/${id}`
      );

      // After successful delete, update the customers state
      setCustomers(customers.filter((customer) => customer._id !== id));
      setShowDeleteConfirm(null); // Close the delete confirmation modal
      toast.success('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData(defaultFormData);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.username &&
        customer.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phoneNumber && customer.phoneNumber.includes(searchTerm))
  );

  const MobileCustomerCard = ({ customer }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <User size={16} className="text-indigo-600" />
        </div>
        <span className="font-medium text-gray-900">{customer.username}</span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Mail size={16} />
          <span className="text-sm break-all">{customer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Phone size={16} />
          <span className="text-sm">{customer.phoneNumber}</span>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => handleEdit(customer)}
          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(customer._id)}
          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <ToastContainer /> {/* Toast Container for notifications */}

      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customers</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Table Section - Hidden on mobile */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={16} className="text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-900">{customer.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer?.email ?? 'NA'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {customer.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(customer._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredCustomers.map((customer) => (
          <MobileCustomerCard key={customer._id} customer={customer} />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 md:p-6 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Are you sure you want to delete this customer?
            </h2>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)} // Cancel
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 md:p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal} // Cancel
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
