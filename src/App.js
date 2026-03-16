import React from "react";
import "./styles/Global.css";
import FoodCourtPage from "./pages/FoodCourtPage";
import AdminDashboard from "./pages/AdminDashboard";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FoodCourts from "./components/FoodCourts";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";
import CTASection from "./components/CTASection";
import "./styles/Global.css";

function MainPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <section id="food-courts">
        <FoodCourts />
      </section>
    <section id="how-it-works">
  <HowItWorks />
</section>


<section id="features">
  <Features />
  <CTASection />
</section>
      <Footer />
    </>
  );
}

/* PROTECTED ROUTE */
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
   <Routes>

<Route
  path="/foodcourt/:id"
  element={
    <ProtectedRoute>
      <FoodCourtPage />
    </ProtectedRoute>
  }
/>

<Route path="/checkout" element={<Checkout />} />
<Route path="/order-status" element={<OrderStatus />} />

<Route path="/" element={<Navigate to="/login" />} />

<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />

<Route
  path="/home"
  element={
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

</Routes>
    </Router>
  );
}

export default App;
