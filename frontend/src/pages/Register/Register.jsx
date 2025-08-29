import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <input name="username" placeholder="Username" value={form.username} onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
