import "./Hero.css";
import heroImage from "../assets/Hero.png";

function Hero() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">

        <h1 className="hero-title">
          Skip the Queue.<br />
          <span>Grab Your Food</span><br />
          Faster.
        </h1>

        <p className="hero-text">
          Pre-order from any KIIT Food Court and collect when ready.
          <br />
          No waiting, no crowding — just food, fast.
        </p>

        <div className="hero-buttons">
          <a href="#food-courts" className="btn-primary">
            🚀 Order Now
          </a>
        </div>

      </div>
    </section>
  );
}

export default Hero;