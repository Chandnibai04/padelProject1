// src/App.tsx
import { Toaster } from "sonner";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Pages
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Courts from "./pages/Courts";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/profile";
import PaymentMethod from "./pages/Paymentmethod";
import PaymentConfirm from "./pages/PaymentConfirm";

AOS.init();

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Layout Route wraps common layout */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="courts" element={<Courts />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="booking" element={<Booking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payment" element={<PaymentMethod />} />
          <Route path="payment-confirm" element={<PaymentConfirm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
