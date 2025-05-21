import { Link } from "react-router-dom";
import { useAuth } from "../Layout/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/">TaskManager</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Tasks</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add">Add a task</Link>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
