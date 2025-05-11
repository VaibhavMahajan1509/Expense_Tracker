// src/components/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { TypeAnimation } from "react-type-animation";
import styles from "./LandingPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Navbar />

      {/* Blob SVG background */}
      <svg
        className={styles.blobBackground}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#ffffff22"
          d="M37.8,-65.1C49.5,-59.1,60.5,-49.4,66.4,-37.3C72.3,-25.2,73,-10.6,71.6,4.6C70.2,19.9,66.6,35.8,57.5,47.7C48.4,59.6,33.9,67.5,18.1,73.6C2.3,79.6,-14.8,83.8,-30.2,79.2C-45.7,74.6,-59.6,61.2,-65.4,45.5C-71.2,29.7,-68.9,11.6,-66.2,-5.4C-63.5,-22.4,-60.3,-38.3,-50.7,-47.4C-41.1,-56.6,-25,-58.9,-9.1,-63.5C6.9,-68.2,13.8,-75.2,25.8,-76.1C37.8,-77.1,54.3,-72.1,66.7,-60.1Z"
          transform="translate(100 100)"
        />
      </svg>

      <main className={`container flex-grow-1 ${styles.main}`}>
        <div className={`row align-items-center ${styles.heroSection}`}>
          <div className="col-md-6 text-center text-md-start position-relative">
            <h1 className={styles.heading}>Track & Budget Wisely</h1>

            <TypeAnimation
              sequence={[
                "Control your money...",
                2000,
                "Track your expenses...",
                2000,
                "Plan your future...",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className={styles.typingEffect}
            />

            <p className={styles.subtext}>
              Easily manage your daily expenses with smart visual insights.
            </p>

            <button
              className={`btn ${styles.ctaButton}`}
              onClick={() => navigate("/dashboard")}
            >
              Get Started
            </button>
          </div>

          <div className="col-md-6 text-center mt-4 mt-md-0">
            <img
              src="./Finance-rafiki.svg"
              alt="Expense illustration"
              className={`img-fluid ${styles.heroImage}`}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
