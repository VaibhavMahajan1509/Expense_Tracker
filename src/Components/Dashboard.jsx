import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUtensils, FaPlane, FaShoppingCart, FaTag } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./Dashboard.module.css";

const categoryIcons = {
  Food: <FaUtensils />,
  Travel: <FaPlane />,
  Shopping: <FaShoppingCart />,
  Other: <FaTag />,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem("expenses")) || []);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState(() => parseFloat(localStorage.getItem("budget")) || "");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [showAlert, setShowAlert] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("budget", budget);

    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    setShowAlert(budget && total > budget);
  }, [expenses, darkMode, budget]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addExpense = () => {
    if (amount && description && date && !isNaN(amount)) {
      const newExpense = {
        amount: parseFloat(amount),
        description,
        category,
        date,
        id: Date.now(),
      };
      const updatedExpenses = [newExpense, ...expenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setExpenses(updatedExpenses);
      setAmount("");
      setDescription("");
      setDate("");
    }
  };

  const setMonthlyBudget = () => {
    if (budgetInput && !isNaN(budgetInput)) {
      setBudget(parseFloat(budgetInput));
      setBudgetInput("");
    }
  };

  const deleteExpense = (id) => setExpenses(expenses.filter((e) => e.id !== id));

  const editExpense = (id) => {
    const exp = expenses.find((e) => e.id === id);
    if (exp) {
      setDescription(exp.description);
      setAmount(exp.amount);
      setCategory(exp.category);
      setDate(exp.date);
      deleteExpense(id);
    }
  };

  const totalExpenses = parseFloat(
    expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  ).toFixed(2);

  const expenseData = expenses.reduce((acc, e) => {
    const found = acc.find((item) => item.category === e.category);
    if (found) {
      found.amount += parseFloat(e.amount) || 0;
    } else {
      acc.push({ category: e.category, amount: parseFloat(e.amount) || 0 });
    }
    return acc;
  }, []);

  const filteredExpenses = expenses
    .filter((e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    );

  const downloadCSV = () => {
    const headers = ["Description", "Amount", "Category", "Date"];
    const rows = expenses.map(exp => [exp.description, `₹${exp.amount}`, exp.category, exp.date]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "expense_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`${styles.dashboard} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h2>💸 Expense Tracker</h2>
        <div>
          <motion.button whileHover={{ scale: 1.05 }} className={styles.btnSecondary} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} className={styles.btnDanger} onClick={handleLogout}>
            Logout
          </motion.button>
        </div>
      </div>

      {showAlert && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={styles.alert}>
          Warning: Your expenses exceed your budget!
        </motion.div>
      )}

      <div className={styles.section}>
        <h3>📊 Set Monthly Budget</h3>
        <input
          type="number"
          placeholder="Enter Budget"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
        />
        <motion.button whileTap={{ scale: 0.95 }} className={styles.btnPrimary} onClick={setMonthlyBudget}>
          Set Budget
        </motion.button>

        {budget && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min((totalExpenses / budget) * 100, 100)}%` }}
              ></div>
            </div>
            <small>
              ₹{totalExpenses} spent / ₹{budget}
            </small>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3>➕ Add Expense</h3>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={styles.btnPrimary}
          onClick={addExpense}
          disabled={!description || !amount || !date}
        >
          Add Expense
        </motion.button>
      </div>

      <div className={styles.section}>
        <h3>📋 Expense List</h3>
        <input
          type="text"
          placeholder="Search by description or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {filteredExpenses.length === 0 ? (
          <p className={styles.empty}>No expenses found.</p>
        ) : (
          <ul className={styles.expenseList}>
            {filteredExpenses.map((expense) => (
              <motion.li
                key={expense.id}
                whileHover={{ scale: 1.02 }}
                className={styles.expenseItem}
              >
                <div>
                  <strong>{expense.description}</strong> - ₹{parseFloat(expense.amount).toFixed(2)} [{expense.category}] {categoryIcons[expense.category]}<br />
                  <small>{expense.date}</small>
                </div>
                <div>
                  <button className={styles.btnWarning} onClick={() => editExpense(expense.id)}>Edit</button>
                  <button className={styles.btnDanger} onClick={() => deleteExpense(expense.id)}>Delete</button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
        <div className={styles.totalExpense}>
          <h5>Total Expense: ₹{totalExpenses}</h5>
        </div>
      </div>

      <div className={styles.section}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowVisualization(!showVisualization)} className={styles.btnSecondary}>
          {showVisualization ? "Hide Visualization" : "Show Visualization"}
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={downloadCSV} className={styles.btnPrimary}>Download CSV</motion.button>
      </div>

      {showVisualization && (
        <motion.div className={styles.chartContainer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
