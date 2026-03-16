import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = (e) => {
  e.preventDefault();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Admin login
  if (email === "admin@kiit.ac.in" && password === "admin123") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "admin");
    navigate("/admin");
    return;
  }

  // Normal user login
  if (
    storedUser &&
    storedUser.email === email &&
    storedUser.password === password
  ) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "user");
    navigate("/home");
  } else {
    setError("Invalid email or password");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back </h2>
        <p className="auth-subtitle">Login to continue to Kuisine</p>

        <form onSubmit={handleLogin}>
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

          <button className="auth-btn">Login</button>
        </form>

        <p className="auth-footer">
          New here? <span onClick={() => navigate("/signup")}>Create account</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
