import { Link, useLocation, Outlet } from "react-router-dom";
import { FaFolderOpen, FaTags } from "react-icons/fa";

export default function AdminDashboard() {
  const { pathname } = useLocation();

  const links = [
    { to: "categories", label: "Manage Categories", icon: <FaFolderOpen /> },
    { to: "tags",       label: "Manage Task Tags", icon: <FaTags /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="p-4"
        style={{
          width:  "260px",
          background: "linear-gradient(135deg, #4e73df 0%, #224abe 100%)",
        }}
      >
        <h4 className="text-white mb-4">⚙️ Admin Menu</h4>
        {links.map(({ to, label, icon }) => {
          const isActive = pathname.endsWith(to);
          return (
            <Link
              key={to}
              to={to}                      // note: relative link!
              className={
                "d-flex align-items-center mb-2 p-2 rounded text-decoration-none " +
                (isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-white")
              }
            >
              <span className="me-2">{icon}</span>
              {label}
            </Link>
          );
        })}
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4">
        <Outlet />        {/* ← this is where your child routes render */}
      </main>
    </div>
  );
}
