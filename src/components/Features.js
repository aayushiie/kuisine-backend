import "./Features.css";

const features = [
  {
    icon: "📡",
    title: "Real-time Order Status",
    desc: "Track your order live — placed → preparing → ready. No guessing, no anxiety."
  },
  {
    icon: "📋",
    title: "Uniform Campus Menu",
    desc: "All five food courts follow a standard menu so you always know what to expect."
  },
  {
    icon: "✅",
    title: "Live Item Availability",
    desc: "Sold-out items are flagged instantly so you never pre-order something unavailable."
  },
  {
    icon: "🪑",
    title: "Table Availability",
    desc: "Seating status per food court helps you plan where to sit before you arrive.",
    tag: "Coming Soon"
  },
  {
    icon: "💵",
    title: "Pay at Counter",
    desc: "No digital wallets needed — just collect your order and pay in cash.",
    tag: "Online Payment Coming Soon"
  },
  {
    icon: "📶",
    title: "Campus Wi-Fi Ready",
    desc: "Lightweight and fast — works perfectly on KIIT campus Wi-Fi or any internet."
  }
];

function Features() {

  return (
    <section className="features-section">

      <div className="container">

        <div className="features-header">

          <p className="label">WHY QUICKBITE</p>

          <h2>Built for Campus Life</h2>

          <p className="subtitle">
            Everything you need to make your lunch break actually feel like a break.
          </p>

        </div>

        <div className="features-grid">

          {features.map((feature, index) => (

            <div className="feature-card" key={index}>

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.desc}</p>

              {feature.tag && (
                <span className="feature-tag">
                  {feature.tag}
                </span>
              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;