import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    
    <nav className={styles.navbar}>
      
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Expense Tracker
        </Link>

        <button className={styles.menuButton} onClick={toggleMenu}>
          ☰
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ""}`}>
          <Link to="/login" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
          <Link to="/signup" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
