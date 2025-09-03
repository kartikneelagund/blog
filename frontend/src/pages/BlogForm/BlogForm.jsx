import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "" });

  // Fetch users + stats
  useEffect(() => {
    if (!user?.isAdmin) return;

    // Fetch all users
    api
      .get("/users/all")
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error(err));

    // Fetch stats
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, [user?.isAdmin]);

  if (!user?.isAdmin) {
    return (
      <div className="admin container">
        <h3>Access Denied</h3>
      </div>
    );
  }

  // Start editing
  const handleEdit = (u) => {
    setEditingUser(u._id);
    setFormData({ username: u.username, email: u.email });
  };

  // Save update
  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/users/${id}`, formData);
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
      setEditingUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "" });
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin container">
      <h2>Admin Panel</h2>

      {/* 🔹 Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Users</h4>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h4>Total Blogs</h4>
          <p>{stats.totalBlogs}</p>
        </div>
        <div className="stat-card">
          <h4>Total Views</h4>
          <p>{stats.totalViews}</p>
        </div>
        <div className="stat-card">
          <h4>Total Likes</h4>
          <p>{stats.totalLikes}</p>
        </div>
      </div>

      {/* 🔹 Users Table */}
      <h3>Manage Users</h3>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                {editingUser === u._id ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                ) : (
                  u.username
                )}
              </td>
              <td>
                {editingUser === u._id ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                ) : (
                  u.email
                )}
              </td>
              <td style={{ textAlign: "center" }}>
                {editingUser === u._id ? (
                  <>
                    <button
                      className="btn save"
                      onClick={() => handleUpdate(u._id)}
                    >
                      Save
                    </button>
                    <button className="btn cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn edit"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

