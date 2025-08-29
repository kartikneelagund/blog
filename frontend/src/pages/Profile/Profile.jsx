import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="profile">
      <h2>Welcome, {user?.username || "User"}</h2>
      <p>Email: {user?.email || "—"}</p>
      {user?.isAdmin && <p className="role">Role: Admin</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
