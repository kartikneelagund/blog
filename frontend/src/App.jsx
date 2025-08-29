import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import BlogDetails from "./pages/BlogDetails/BlogDetails";
import BlogForm from "./pages/BlogForm/BlogForm";
import Admin from "./pages/Admin/Admin";
import ProtectedRoute from "./components/ProtectedRouter/ProtectedRoute";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/blogs/:id" element={<BlogDetails />} />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
              
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer/>
    </>
  );
}
