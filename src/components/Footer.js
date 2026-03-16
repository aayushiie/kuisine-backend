import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2 className="footer-logo">Kuisine</h2>
          <p>
            A campus food pre-ordering system designed to help KIIT students
            skip long queues and collect food faster.
          </p>

          <div className="footer-wifi">
            📶 Works on KIIT Campus Wi-Fi or Internet
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="footer-column">
          <h4>Navigation</h4>
          <a href="#home">Home</a>
          <a href="#food-courts">Food Courts</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
        </div>

        {/* FOOD COURTS */}
        <div className="footer-column">
          <h4>Food Courts</h4>
          <a href="#">Campus Square</a>
          <a href="#">Techno Bites</a>
          <a href="#">Green Bowl</a>
          <a href="#">Pit Stop</a>
        </div>

        {/* SUPPORT */}
        <div className="footer-column">
          <h4>Support</h4>
          <a href="#">Contact</a>
          <a href="#">Report Issue</a>
          <a href="#">FAQ</a>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        © 2026 Kuisine · Built for KIIT University
      </div>

    </footer>
  );
}

export default Footer;