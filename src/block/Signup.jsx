import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState(""); // NEW state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password }) // include username
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
      } else {
        setSuccess("Signup successful! You can now log in.");
        setFullName("");
        setUsername(""); // clear username
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Failed to connect to the server");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>Create Your Account</h1>
        <p>Join our growing community and unlock members-only content.</p>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign up</h2>

          {/* Full Name */}
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

          {/* Username - NEW */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Error & Success Messages */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          {/* Submit Button */}
          <button type="submit" className="login-btn">Sign up</button>

          {/* Redirect Link */}
          <p className="signup-text">
            Already have an account? <Link to={"/login"}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
