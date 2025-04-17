const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shriyash27@",
  database: "expense_tracker"
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("DB connected ✅");
  }
});

// Add Expense
app.post('/expenses', (req, res) => {
  const { user_id, title, amount, category, expense_date } = req.body;
  const q = `INSERT INTO expenses (user_id, title, amount, category, expense_date, created_at) VALUES (?, ?, ?, ?, ?, NOW())`;
  db.query(q, [user_id, title, amount, category, expense_date], (err, result) => {
    if (err) {
      console.error("Insert error", err);
      return res.status(500).send("Insert failed");
    }
    res.send("Expense added ✅");
  });
});

// Get Expenses
app.get('/expenses/:user_id', (req, res) => {
  const q = `SELECT * FROM expenses WHERE user_id = ? ORDER BY expense_date DESC`;
  db.query(q, [req.params.user_id], (err, data) => {
    if (err) {
      console.error("Fetch error", err);
      return res.status(500).send("Fetch failed");
    }
    res.json(data);
  });
});

// Delete Expense
app.delete('/expenses/:id', (req, res) => {
  db.query(`DELETE FROM expenses WHERE id = ?`, [req.params.id], (err) => {
    if (err) {
      console.error("Delete error", err);
      return res.status(500).send("Delete failed");
    }
    res.send("Deleted ✅");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
