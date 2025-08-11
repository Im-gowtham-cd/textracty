import { useState } from "react";
import {Link} from "react-router-dom"

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);
    // TODO: Call backend signup API here
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>Create Your Account</h1>
        <p>
          Join our growing community and unlock access to members-only content,
          tools, and personalized experiences.
        </p>
      </div>

      {/* Right side signup form */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign up</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

          <button type="submit" className="login-btn">Sign up</button>

          <p className="signup-text">
            Already have an account? <Link to={"/login"}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
