import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./OrderStatus.css";

function OrderStatus() {

  const { state } = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {

    const interval = setInterval(() => {

      const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

      const currentOrder = orders.find(
        o => o.id === state?.orderId
      );

      setOrder(currentOrder);

    }, 2000);

    return () => clearInterval(interval);

  }, [state?.orderId]);

  return (

    <div className="order-status-page">

      <div className="order-card">

        <h2>🍱 Order Status</h2>

        <p className="order-id">
          Order ID: <span>{order?.id}</span>
        </p>

        <div className={`status-badge ${order?.status?.toLowerCase()}`}>
          {order?.status}
        </div>

        <div className="order-items">

          {order?.items?.map(item => (
            <div key={item.id} className="order-item">

              <span>{item.name} × {item.qty}</span>

              <span>₹{item.price * item.qty}</span>

            </div>
          ))}

        </div>

        <div className="order-total">
          Total ₹{order?.total}
        </div>

        {order?.status === "Ready" && (
          <p className="ready-msg">
            🎉 Your order is ready! Please collect from the counter.
          </p>
        )}

      </div>

    </div>

  );
}

export default OrderStatus;