import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  FaUtensils, FaPlane, FaShoppingCart, FaTag, FaHeart,
  FaBook, FaFilm, FaBolt, FaUserCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./Dashboard.module.css";
import {
  addExpenseToFirebase,
  getExpensesFromFirebase,
  deleteExpenseFromFirebase,
  updateExpenseInFirebase
} from "../utils/firebaseUtils";

const categoryIcons = {
  Food: <FaUtensils />,
  Travel: <FaPlane />,
  Shopping: <FaShoppingCart />,
  Health: <FaHeart />,
  Education: <FaBook />,
  Entertainment: <FaFilm />,
  Utilities: <FaBolt />,
  PersonalCare: <FaUserCircle />,
  Other: <FaTag />,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState("");
  const [search, setSearch] = useState("");
  const [showVisualization, setShowVisualization] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setLoading(true);
      setError(null);
      if (user) {
        const unsubscribeExpenses = getExpensesFromFirebase((fetchedExpenses) => {
          setExpenses(fetchedExpenses || []);
          setLoading(false);
        });
        return () => unsubscribeExpenses();
      } else {
        setExpenses([]);
        setBudget("");
        setLoading(false);
        navigate("/");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    const total = parseFloat(
      (expenses || []).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    ).toFixed(2);
    setShowAlert(budget && total > budget);
  }, [expenses, budget]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      setError("Logout error: " + error.message);
    }
  };

  const addExpense = async () => {
    if (!amount || !description || !date || isNaN(amount)) {
      setError("Please fill in all fields with valid data.");
      return;
    }

    const newExpense = {
      amount: parseFloat(amount),
      description,
      category,
      date,
    };

    try {
      await addExpenseToFirebase(newExpense);
      setAmount("");
      setDescription("");
      setDate("");
      setError(null);
    } catch (error) {
      setError("Error adding expense: " + error.message);
    }
  };

  const setMonthlyBudget = () => {
    if (budgetInput && !isNaN(budgetInput)) {
      setBudget(parseFloat(budgetInput));
      setBudgetInput("");
    } else {
      setError("Please enter a valid budget amount.");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteExpenseFromFirebase(id);
    } catch (error) {
      setError("Error deleting expense: " + error.message);
    }
  };

  const startEdit = (expense) => {
    setEditId(expense.id);
    setEditFields({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateExpenseInFirebase(id, editFields);
      setEditId(null);
    } catch (error) {
      setError("Error updating expense: " + error.message);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const filteredExpenses = (expenses || []).filter((e) =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const expenseData = (expenses || []).reduce((acc, e) => {
    const found = acc.find((item) => item.category === e.category);
    if (found) {
      found.amount += parseFloat(e.amount) || 0;
    } else {
      acc.push({ category: e.category, amount: parseFloat(e.amount) || 0 });
    }
    return acc;
  }, []);

  const totalExpenses = parseFloat(
    (expenses || []).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  ).toFixed(2);

  return (
    <div className={`${styles.dashboard} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h2>💸 Expense Tracker</h2>
        <div>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setDarkMode(!darkMode)} className={styles.btnSecondary}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={handleLogout} className={styles.btnDanger}>
            Logout
          </motion.button>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={styles.alert}>
          {error}
        </motion.div>
      )}

      {showAlert && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={styles.alert}>
          Warning: Your expenses exceed your budget!
        </motion.div>
      )}

      <div className={styles.section}>
        <h3>📊 Set Monthly Budget</h3>
        <input type="number" placeholder="Enter Budget" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
        <motion.button whileTap={{ scale: 0.95 }} onClick={setMonthlyBudget} className={styles.btnPrimary}>
          Set Budget
        </motion.button>
        {budget && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${Math.min((totalExpenses / budget) * 100, 100)}%` }}></div>
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
          {Object.keys(categoryIcons).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <motion.button whileTap={{ scale: 0.95 }} onClick={addExpense} className={styles.btnPrimary}>
          Add Expense
        </motion.button>
      </div>

      <div className={styles.section}>
        <h3>📋 Expense List</h3>
        {loading ? (
          <p>Loading expenses...</p>
        ) : (
          <>
            <input type="text" placeholder="Search by description or category" value={search} onChange={(e) => setSearch(e.target.value)} />
            {filteredExpenses.length === 0 ? (
              <p className={styles.empty}>No expenses found.</p>
            ) : (
              <ul className={styles.expenseList}>
                {filteredExpenses.map((expense) => (
                  <motion.li key={expense.id} whileHover={{ scale: 1.02 }} className={styles.expenseItem}>
                    {editId === expense.id ? (
                      <div>
                        <input value={editFields.description} onChange={(e) => setEditFields({ ...editFields, description: e.target.value })} />
                        <input type="number" value={editFields.amount} onChange={(e) => setEditFields({ ...editFields, amount: e.target.value })} />
                        <input type="date" value={editFields.date} onChange={(e) => setEditFields({ ...editFields, date: e.target.value })} />
                        <select value={editFields.category} onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}>
                          {Object.keys(categoryIcons).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button className={styles.btnPrimary} onClick={() => saveEdit(expense.id)}>Save</button>
                        <button className={styles.btnWarning} onClick={cancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <strong>{expense.description}</strong> - ₹{parseFloat(expense.amount).toFixed(2)} [{expense.category}]
                        {categoryIcons[expense.category] || ""}<br />
                        <small>{expense.date}</small>
                      </div>
                    )}
                    {editId !== expense.id && (
                      <div>
                        <button className={styles.btnSecondary} onClick={() => startEdit(expense)}>Edit</button>
                        <button className={styles.btnWarning} onClick={() => deleteExpense(expense.id)}>Delete</button>
                      </div>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
            <div className={styles.totalExpense}>
              <h5>Total Expense: ₹{totalExpenses}</h5>
            </div>
          </>
        )}
      </div>

      <div className={styles.section}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowVisualization(!showVisualization)} className={styles.btnSecondary}>
          {showVisualization ? "Hide Visualization" : "Show Visualization"}
        </motion.button>
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
