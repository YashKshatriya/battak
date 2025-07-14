import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const Orders = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/v1/dishes/');
        setMenuItems(response.data);
      } catch (error) {
        toast.error('Error fetching menu items. Please try again later.');
      }
    };

    fetchMenuItems();
  }, []);

  // Load cart data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCustomerName = localStorage.getItem('customerName');
    const savedPhoneNumber = localStorage.getItem('phoneNumber');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedCustomerName) {
      setCustomerName(savedCustomerName);
    }
    if (savedPhoneNumber) {
      setPhoneNumber(savedPhoneNumber);
    }
  }, []);

  // Save cart and customer details to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('customerName', customerName);
    localStorage.setItem('phoneNumber', phoneNumber);
  }, [cart, customerName, phoneNumber]);

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);

    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem._id === item._id 
          ? {...cartItem, quantity: cartItem.quantity + 1} 
          : cartItem
      ));
    } else {
      setCart([...cart, {...item, quantity: 1}]);
    }
    toast.success(`${item.name} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
    toast.info('Item removed from cart.');
  };

  // Update cart item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item._id === itemId ? {...item, quantity: newQuantity} : item
      ));
      toast.success('Quantity updated!');
    }
  };

  // Calculate total price and total quantity
  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = total * 0.18; // 18% GST
    const totalPrice = total + gst; // Add GST to total price
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { total, gst, totalPrice, totalQuantity };
  };

  // Submit cart
  const submitCart = async () => {
    if (!customerName || !phoneNumber) {
      toast.error('Please fill in your name and phone number.');
      return;
    }

    const { total, gst, totalPrice, totalQuantity } = calculateTotal();

    const orderData = {
      user: customerName, 
      phoneNumber: phoneNumber, 
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalQuantity,
      totalPrice: totalPrice.toFixed(2), 
    };

    try {
      await axios.post('http://localhost:3002/api/v1/customer/cart', orderData);
      setCart([]);
      setCustomerName('');
      setPhoneNumber('');
      localStorage.removeItem('cart');
      localStorage.removeItem('customerName');
      localStorage.removeItem('phoneNumber');
      toast.success('Order submitted successfully!');
    } catch (error) {
      toast.error('Error submitting order. Please try again.');
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setPhoneNumber('');
    localStorage.removeItem('cart');
    localStorage.removeItem('customerName');
    localStorage.removeItem('phoneNumber');
    toast.info('Cart cleared.');
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <ToastContainer />
      {/* Menu Items Section */}
      <div className="w-full md:w-2/3">
        <Card>
          <CardHeader>
            <CardTitle className="text-indigo-600">Menu Items</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {menuItems.map(item => (
              <div 
                key={item._id} 
                className="border rounded-lg p-3 flex flex-col items-center bg-indigo-50"
              >
                <h3 className="font-bold text-indigo-800">{item.name}</h3>
                <p className="text-indigo-600">₹{item.price}</p>
                <Button 
                  onClick={() => addToCart(item)} 
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="mr-2" /> Add to Cart
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-1/3">
        <Card>
          <CardHeader>
            <CardTitle className="text-indigo-600">
              <ShoppingCart className="inline mr-2 text-indigo-600" /> 
              Your Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Customer Details Input */}
            <div className="mb-4">
              <Input 
                placeholder="Your Name" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mb-2 border-indigo-300 focus:border-indigo-600"
              />
              <Input 
                placeholder="Phone Number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-indigo-300 focus:border-indigo-600"
              />
            </div>

            {/* Cart Items */}
            {cart.map(item => (
              <div 
                key={item._id} 
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <span className="text-indigo-800">{item.name}</span>
                  <span className="ml-2 text-indigo-600">₹{item.price}</span>
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-indigo-600 hover:bg-indigo-50"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="mx-2 text-indigo-800">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-indigo-600 hover:bg-indigo-50"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {/* Total Calculation */}
            {cart.length > 0 && (
              <div className="mt-4 font-bold text-indigo-800">
                Total: ₹{calculateTotal().totalPrice.toFixed(2)} (Including GST)
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={submitCart} 
              disabled={cart.length === 0 || !customerName || !phoneNumber}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Submit Order
            </Button>
            <Button 
              onClick={clearCart} 
              className="ml-4 bg-black text-white hover:bg-gray-800"
            >
              Clear Cart
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Orders;
