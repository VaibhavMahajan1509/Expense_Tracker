// src/components/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p>&copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
      </footer>
    );
  };
  
  export default Footer;