import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:3002/api/v1/customer/register/request-otp', { username, phoneNumber, email, password });
      setStep(2);
      setMessage('OTP sent to your email.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error requesting OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:3002/api/v1/customer/register/verify-otp', { email, otp, password, username, phoneNumber });
      setMessage('Registration successful!');
      // Optionally redirect or set auth state here
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error verifying OTP');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {message && <div className="mb-4 text-center text-red-600">{message}</div>}
      {step === 1 && (
        <form onSubmit={handleRequestOtp}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-3 border rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-2 mb-3 border rounded"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Requesting OTP...' : 'Request OTP'}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-2 mb-3 border rounded"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
      <div className="mt-4 text-center">
        <a href="/login" className="text-[#6E493A] text-sm underline hover:text-[#987284]">Go to Login</a>
      </div>
    </div>
  );
};

export default Register; 