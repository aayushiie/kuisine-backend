import "./CTASection.css";

function CTASection() {
  return (
    <section className="cta-section">

      <div className="cta-container">

        {/* LEFT TEXT */}
        <div className="cta-text">

          <p className="cta-label">START ORDERING</p>

          <h2>
            Your lunch break <br />
            deserves a real break.
          </h2>

          <p className="cta-desc">
            Join hundreds of KIIT students already skipping the queue.
            Pre-order in under 60 seconds — right from your browser.
          </p>

          <div className="cta-buttons">

            <button className="cta-btn-primary">
              🍱 Order Now
            </button>

            <button className="cta-btn-outline">
              See How It Works
            </button>

          </div>

        </div>

        {/* PHONE MOCKUP */}

        <div className="phone-mockup">

          <div className="phone-screen">

            <div className="app-logo">🍱</div>

            <h4>QuickBite</h4>

            <p>Your order is</p>

            <span className="ready">✓ Ready!</span>

            <p className="location">Campus Square FC</p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CTASection;