// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Sidebar from './components/Siderbar'; // Import Sidebar component
// import Dashboard from '../src/components/Pages/Dashboard'; // Import Dashboard page
// import Customers from '../src/components/Pages/Customers'; // Import Customers page
// import MenuEditor from '../src/components/Pages/MenuEditor'; // Import MenuEditor page
// import OrderHistory from '../src/components/Pages/OrderHistory'; // Import OrderHistory page
// import Orders from '../src/components/Pages/Orders'; // Import Orders page
// import RealTimeOrders from '../src/components/Pages/RealTimeOrders';

// function App() {
//   return (
//     <Router>
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content Area */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/real-time-orders" element={<RealTimeOrders />} />
//             <Route path="/customers" element={<Customers />} />
//             <Route path="/menu-editor" element={<MenuEditor />} />
//             <Route path="/order-history" element={<OrderHistory />} />
//             <Route path="/orders" element={<Orders />} />
//             {/* Add a default route for the home page or fallback */}
//             <Route path="/" element={<Dashboard />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Sidebar from './components/Siderbar'; // Import Sidebar component
import Dashboard from '../src/components/Pages/Dashboard'; // Import Dashboard page
import Customers from '../src/components/Pages/Customers'; // Import Customers page
import MenuEditor from '../src/components/Pages/MenuEditor'; // Import MenuEditor page
import OrderHistory from '../src/components/Pages/OrderHistory'; // Import OrderHistory page
import Orders from '../src/components/Pages/Orders'; // Import Orders page
import RealTimeOrders from '../src/components/Pages/RealTimeOrders';
import SignupPage from './components/Pages/SignupPage';
import LoginPage from './components/Pages/LoginPage';

function App() {
  const notify = () => {
    toast.success("Welcome to the Dashboard!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Toast Container */}
          <ToastContainer />
          
          <Routes>
            <Route 
              path="/dashboard" 
              element={<Dashboard />} 
              onEnter={notify} // Trigger toast on page load
            />
            <Route path="/real-time-orders" element={<RealTimeOrders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/menu-editor" element={<MenuEditor />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/orders" element={<Orders />} />
            {/* Add a default route for the home page or fallback */}
            {/* <Route path="/signup" element={<SignupPage />} /> */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
