import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MenuEditor = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);

  const categories = ["favorites", "Drinks", "Lunch", "Combo", "Sweet"];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/v1/dishes/");
        setItems(response.data);
      } catch (error) {
        toast.error("Error fetching menu items. Please try again later.");
      }
    };

    fetchMenuItems();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("category", e.target.category.value);
    formData.append("price", parseFloat(e.target.price.value));
    if (image) {
      formData.append("image", image);
    }
    try {
      let response;
      if (editItem) {
        // Update existing item (still send as JSON for now)
        response = await axios.put(
          `http://localhost:3002/api/v1/dishes/${editItem._id}`,
          {
            name: e.target.name.value,
            category: e.target.category.value,
            price: parseFloat(e.target.price.value),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Item updated successfully!");
      } else {
        // Add new item with image
        response = await axios.post("http://localhost:3002/api/v1/dishes/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Item added successfully!");
      }
      const savedItem = response.data;
      if (editItem) {
        setItems(items.map((item) => (item._id === editItem._id ? savedItem : item)));
      } else {
        setItems([...items, savedItem]);
      }
      setEditItem(null);
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to save item! Please check the data.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/v1/dishes/${id}`);
      setItems(items.filter((item) => item._id !== id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete item!");
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-gray-50 overflow-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu Editor</h1>
        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-lg font-semibold text-indigo-600 mt-1">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditItem(item);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editItem ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editItem?.name || ""}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  defaultValue={editItem?.category || categories[0]}
                  className="w-full p-2 border rounded-lg"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={editItem?.price || ""}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
