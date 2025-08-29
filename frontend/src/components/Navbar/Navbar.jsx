import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-inner container">

        
        {/* Brand / Logo */}
        <Link to="/" className="brand">Blogging Platform</Link>

        <div className="nav-right">
          {/* Always visible */}
          <Link to="/">Home</Link>

          {/* Only logged-in users */}
          {user && <Link to="/create">New Post</Link>}

          {/* Only admins */}
          {user?.isAdmin && <Link to="/admin">Admin</Link>}

          {user ? (
            <>
              {/* Now shows user._id instead of "User" */}
              <Link to="/profile">
               Hello, {user?.username || user?._id}
              </Link>


              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
