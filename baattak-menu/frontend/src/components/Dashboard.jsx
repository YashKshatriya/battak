import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState("");
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
                setMenuItems(response.data);
            } catch (error) {
                setMenuItems([]);
            }
        };
        fetchMenuItems();
    }, []);
    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="flex">
            <div className="flex-grow min-h-screen bg-gray-100 p-4 transition-all duration-300">
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 text-center">Our Menu</h1>
                    <input
                        type="text"
                        placeholder="Search for a dish..."
                        className="w-full p-3 mt-4 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </header>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
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
                        <p className="text-center text-xl text-gray-600 col-span-full">No menu items found.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
