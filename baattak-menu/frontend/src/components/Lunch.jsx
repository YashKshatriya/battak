
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { useNavigate } from 'react-router-dom';

const Lunch = () => {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/v1/dishes/');
        setMenuItems(response.data.filter(item => item.category === 'Lunch'));
      } catch (error) {
        setMenuItems([]);
      }
    };
    fetchMenuItems();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lunch</h1>
      </header>
      <hr className="my-4 border-gray-300" />
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div key={item._id} className="relative w-full h-80 shadow-lg cursor-pointer transition-all duration-150 flex items-center justify-center bg-white hover:scale-105 active:scale-95 group rounded-lg">
              <div className="w-full h-full relative">
                {item.imageUrl ? (
                  <img
                    src={`http://localhost:3002${item.imageUrl}`}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg text-gray-500">No Image</div>
                )}
              </div>
              <div className="absolute flex items-center left-2 top-2 bg-opacity-90 bg-black py-1 px-3 rounded-lg">
                <span className="text-lg font-normal text-white mr-2">{item.name}</span>
                <span className="text-xl font-semibold text-white">₹{item.price}</span>
              </div>
              <div className="absolute left-0 bottom-0 w-full h-12 bg-green-600 text-white font-semibold uppercase opacity-0 transition-all duration-150 text-center flex items-center justify-center group-hover:opacity-100 group-hover:translate-y-0 active:h-14 rounded-b-lg">
                <button
                  onClick={() => addToCart({ ...item, image: item.imageUrl ? `http://localhost:3002${item.imageUrl}` : '' })}
                  className="w-full h-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-gray-600 col-span-full">No lunch items found.</p>
        )}
      </section>
    </div>
  );
};

export default Lunch;
