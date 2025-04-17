import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Form, Button, Table, Badge, Card, Spinner } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "", expense_date: "" });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const userId = 1;

  const categories = ["Food", "Travel", "Shopping", "Other"];

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/expenses/${userId}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/expenses", { ...form, user_id: userId });
      toast.success("Expense Added!");
      setForm({ title: "", amount: "", category: "", expense_date: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense", err);
      toast.error("Failed to add expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/expenses/${id}`);
      toast.success("Expense Deleted!");
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense", err);
      toast.error("Failed to delete");
    }
  };

  const filteredExpenses = filter === "All" ? expenses : expenses.filter(e => e.category === filter);
  const total = filteredExpenses.reduce((acc, e) => acc + parseFloat(e.amount), 0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case "Food": return "success";
      case "Travel": return "warning";
      case "Shopping": return "primary";
      case "Other": return "secondary";
      default: return "dark";
    }
  };

  return (
    <Container className="my-5">
      <ToastContainer />
      <Card className="p-4 shadow mb-5 border-start border-4 border-primary">
        <h2 className="text-center mb-4 text-primary fw-bold">💸 Expense Tracker</h2>
        <Form onSubmit={handleAdd}>
          <Row className="g-3">
            <Col md={3}>
              <Form.Control
                placeholder="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Amount (₹)"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
              />
            </Col>
            <Col md={2}>
              <Form.Select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Category</option>
                {categories.map((c, i) => <option key={i}>{c}</option>)}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                value={form.expense_date}
                onChange={e => setForm({ ...form, expense_date: e.target.value })}
                required
              />
            </Col>
            <Col md={2}>
              <Button type="submit" className="w-100 btn-success shadow-sm">Add</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row className="align-items-center mb-4">
        <Col md={6}>
          <Card className="p-3 bg-gradient shadow border-start border-4 border-success">
            <h5 className="m-0">Total Spent: <span className="text-success fw-bold">₹{total.toFixed(2)}</span></h5>
          </Card>
        </Col>
        <Col md={6}>
          <Form.Select value={filter} onChange={e => setFilter(e.target.value)} className="shadow-sm">
            <option>All</option>
            {categories.map((c, i) => <option key={i}>{c}</option>)}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-4"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Card className="p-3 shadow-sm">
          <Table bordered hover responsive className="mb-0 text-center">
            <thead className="table-primary">
              <tr>
                <th>Title</th>
                <th>Amount (₹)</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td className="fw-semibold text-success">₹{exp.amount}</td>
                  <td><Badge bg={getCategoryColor(exp.category)}>{exp.category}</Badge></td>
                  <td>{exp.expense_date}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(exp.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-muted">No expenses found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}

export default App;
