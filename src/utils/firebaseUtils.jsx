import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import { auth } from "../firebase";

// Add a new expense
export const addExpenseToFirebase = async (expense) => {
  const db = getDatabase();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const userRef = ref(db, `expenses/${user.uid}`);
  await push(userRef, expense);
};

// Get all expenses for the current user in real-time
export const getExpensesFromFirebase = (callback) => {
  const db = getDatabase();
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }
  const expensesRef = ref(db, `expenses/${user.uid}`);
  const unsubscribe = onValue(
    expensesRef,
    (snapshot) => {
      const data = snapshot.val();
      const expenses = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      callback(expenses);
    },
    (error) => {
      console.error("Error fetching expenses:", error);
      callback([]);
    }
  );
  return unsubscribe; // Return unsubscribe function to clean up listener
};

// Delete a specific expense
export const deleteExpenseFromFirebase = async (expenseId) => {
  const db = getDatabase();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const expenseRef = ref(db, `expenses/${user.uid}/${expenseId}`);
  await remove(expenseRef);
};

// Update a specific expense
export const updateExpenseInFirebase = async (expenseId, updatedExpense) => {
  const db = getDatabase();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const expenseRef = ref(db, `expenses/${user.uid}/${expenseId}`);
  await update(expenseRef, updatedExpense);
};

