// src/components/Footer.jsx
import styles from "./Footer.module.css";

const Footer = () => {
    return (
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
      </footer>
    );
  };
  
  export default Footer;