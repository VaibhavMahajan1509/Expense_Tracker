import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", email);
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
  <div className={styles.signupPage}>
    <div className={styles.introSection}>
      <h1 className={styles.heading}>Create Your Account 🚀</h1>
      <p className={styles.subheading}>
        Start tracking your expenses and take control of your finances.
      </p>
    </div>

    <form onSubmit={handleSignup} className={styles.formWrapper}>
      <h3 className={styles.title}>Sign Up</h3>

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
        <small className={styles.helperText}>
          Password must be at least 6 characters.
        </small>
      </div>

      <button type="submit" className={styles.submitBtn}>Sign Up</button>
    </form>
  </div>
);

  
};

export default SignUp;

