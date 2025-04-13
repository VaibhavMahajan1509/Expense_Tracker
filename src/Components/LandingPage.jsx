// src/components/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "./LandingPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container flex-grow-1 d-flex justify-content-center align-items-center">
        <div className={styles.heroSection}>
          <h1 className={styles.heading}>Expense Tracker</h1>
          <p className={styles.subtext}>
            Track your expenses and manage your budget effortlessly.
          </p>
          <button
            className={`btn btn-warning ${styles.ctaButton}`}
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
