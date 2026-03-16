import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    const kiitEmailPattern = /^[0-9]+@kiit\.ac\.in$/;

    if (!kiitEmailPattern.test(email)) {
      setError("Only KIIT email IDs are allowed.");
      return;
    }

    setError("");

    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p className="auth-subtitle">Join Kuisine today</p>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="KIIT Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;