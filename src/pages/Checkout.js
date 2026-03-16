import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Checkout.css";

function Checkout() {

  const navigate = useNavigate();
  const location = useLocation();

  const cart = location.state?.cart || [];
  const total = location.state?.total || 0;

  const [payment, setPayment] = useState("");

  const placeOrder = () => {

    if (!payment) {
      alert("Please select a payment method");
      return;
    }

    const orderId = "ORD" + Date.now();

    const order = {
      id: orderId,
      items: cart,
      total: total,
      status: "Preparing",
      payment: payment,
      time: new Date().toLocaleTimeString()
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    existingOrders.push(order);

    localStorage.setItem("orders", JSON.stringify(existingOrders));

    navigate("/order-status", { state: { orderId } });

  };

  return (
    <div className="checkout-page">

<h2>🧾 Order Summary</h2>
      <div className="checkout-items">
        {cart.map(item => (
          <div key={item.id} className="checkout-item">
            <span>{item.name} x {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <h3 className="checkout-total">Total: ₹{total}</h3>

      <div className="payment-box">

        <h4>Payment Method</h4>

        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="counter"
            onChange={(e) => setPayment(e.target.value)}
          />
          <span>💰 Pay at Counter</span>
        </label>

      </div>

      <button
        className="place-order-btn"
        onClick={placeOrder}
      >
        Place Order
      </button>

    </div>
  );
}

export default Checkout;