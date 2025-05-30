import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // ✅ Path to your firebase config
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", email);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.headerText}>
        <h1>Welcome Back 👋</h1>
        <p>Please login to access your expense dashboard</p>
      </div>

      <form onSubmit={handleLogin} className={styles.formWrapper}>
        <h2 className={styles.title}>Login</h2>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Login
        </button>
        <p className={styles.helperText}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")} className={styles.link}>
            Sign up first
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
