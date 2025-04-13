import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 🔥 Add this line
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // 🔴 Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", email); // optional
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError(error.message);
      }
      console.error("Signup error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4">Sign Up</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <small className="text-muted">Password must be at least 6 characters.</small>
      </div>

      <button type="submit" className="btn btn-primary w-100">Sign Up</button>
    </form>
  );
};

export default SignUp;


