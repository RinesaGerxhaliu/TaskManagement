import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const isAdmin = Boolean(user?.isAdmin);

  console.log("Navbar user:", user);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/">
        TaskManager
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Tasks
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/add">
              Add a task
            </Link>
          </li>

          {isAdmin && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Dashboard
              </Link>
            </li>
          )}

          <li className="nav-item">
            <button
              className="btn btn-link nav-link"
              onClick={logout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
