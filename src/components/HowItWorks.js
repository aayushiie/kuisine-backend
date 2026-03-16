import "./HowItWorks.css";

const steps = [
  {
    id: 1,
    icon: "🏪",
    title: "Select Food Court",
    desc: "Pick from 5 campus outlets based on location and availability."
  },
  {
    id: 2,
    icon: "📋",
    title: "Browse the Menu",
    desc: "Explore live menu with real-time item availability before ordering."
  },
  {
    id: 3,
    icon: "🔔",
    title: "Get Notified",
    desc: "Receive a ready alert so you arrive exactly when your food is done."
  },
  {
    id: 4,
    icon: "🧾",
    title: "Collect & Pay",
    desc: "Walk in, collect your order, and pay at the counter. Zero queue."
  }
];

function HowItWorks() {
  return (
    <section className="how-section">

      <div className="container">

        <div className="how-header">
          <p className="label">SIMPLE AS 1-2-3-4</p>
          <h2>How QuickBite Works</h2>
          <p className="subtitle">
            From hunger to hand-pickup in four effortless steps.
          </p>
        </div>

        <div className="steps-row">

          {steps.map(step => (
            <div className="step" key={step.id}>

              <div className="step-icon">
                {step.icon}
                <span className="step-number">{step.id}</span>
              </div>

              <h3>{step.title}</h3>

              <p>{step.desc}</p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;