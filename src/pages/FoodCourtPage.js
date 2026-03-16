import { useState } from "react";
import "./FoodCourtPage.css";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: 1, name: "Veg Burger", price: 60, desc: "Crispy patty with fresh veggies", type: "veg", category: "Meals", popular: true },
  { id: 2, name: "Chicken Burger", price: 90, desc: "Juicy grilled chicken patty", type: "nonveg", category: "Meals", popular: true },
  { id: 3, name: "French Fries", price: 50, desc: "Golden crispy fries", type: "veg", category: "Snacks" },
  { id: 4, name: "Samosa (2 pcs)", price: 20, desc: "Classic spiced potato samosa", type: "veg", category: "Snacks", popular: true },
  { id: 5, name: "Cold Coffee", price: 70, desc: "Chilled creamy coffee", type: "veg", category: "Beverages" }
];

function FoodCourtPage() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);

    if (existing) {
      setCart(cart.map(i =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increase = (id) => {
    setCart(cart.map(i =>
      i.id === id ? { ...i, qty: i.qty + 1 } : i
    ));
  };

  const decrease = (id) => {
    setCart(cart.map(i =>
      i.id === id ? { ...i, qty: i.qty - 1 } : i
    ).filter(i => i.qty > 0));
  };

  const filtered = menuItems.filter(item =>
    (category === "All" || item.category === category) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="menu-page">

      {/* HEADER */}
      <div className="menu-header">
        <h2>🍴 Food Court Menu</h2>

        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Cart ({cartCount})
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="menu-search"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY */}
      <div className="category-row">
        {["All", "Snacks", "Meals", "Beverages"].map(cat => (
          <button
            key={cat}
            className={`category ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <div className="menu-grid">

        {filtered.map(item => {

          const cartItem = cart.find(i => i.id === item.id);

          return (
            <div className="menu-card" key={item.id}>

              {item.popular && (
                <div className="popular-badge">⭐ Popular</div>
              )}

              <div className="menu-card-top">
                <h3>
                  <span className={item.type}></span>
                  {item.name}
                </h3>

                <span className="price">₹{item.price}</span>
              </div>

              <p className="desc">{item.desc}</p>

              {cartItem ? (
                <div className="qty-box">
                  <button onClick={() => decrease(item.id)}>-</button>
                  <span>{cartItem.qty}</span>
                  <button onClick={() => increase(item.id)}>+</button>
                </div>
              ) : (
                <button className="add-btn" onClick={() => addToCart(item)}>
                  + Add to Cart
                </button>
              )}

            </div>
          );

        })}

      </div>

      {/* CART PANEL */}

      {cartOpen && <div className="cart-overlay" onClick={()=>setCartOpen(false)}></div>}

      <div className={`cart-panel ${cartOpen ? "open" : ""}`}>

        <div className="cart-header">
          <h3>Your Cart</h3>
          <button onClick={() => setCartOpen(false)}>✖</button>
        </div>

        {cart.length === 0 && <p className="empty">Cart is empty</p>}

        {cart.map(item => (
          <div className="cart-item" key={item.id}>

            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>
            </div>

            <div className="qty">
              <button onClick={() => decrease(item.id)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increase(item.id)}>+</button>
            </div>

          </div>
        ))}

        {cart.length > 0 && (
          <>
            <div className="cart-total">
              Total: ₹{total}
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout", { state: { cart, total } })}
            >
              Checkout
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default FoodCourtPage;