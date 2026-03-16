import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>

      <div className="nav-logo">
        {/*<div className="logo-icon">🍱</div>*/}
        <span className="nav-logo-text">
          Kui<span>sine</span>
        </span>
      </div>

      <ul className="nav-links">
        <li><a href="#food-courts">Food Courts</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#features">Features</a></li>
      </ul>

      <div className="nav-right">
        <button className="order-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;