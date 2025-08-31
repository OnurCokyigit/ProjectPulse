import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import WorkPackages from "./pages/WorkPackages";
import Departments from "./pages/Departments";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "text-sm px-2 py-1 rounded " + (isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white")
    }
  >
    {children}
  </NavLink>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <nav className="border-b border-white/10 sticky top-0 backdrop-blur bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
            <div className="font-semibold">GeoERP</div>
            <NavItem to="/dashboard">Gösterge Paneli</NavItem>
            <NavItem to="/projects">Projeler</NavItem>
            <NavItem to="/work-packages">İş Paketleri</NavItem>
            <NavItem to="/departments">Departmanlar</NavItem>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:project_id" element={<ProjectDetail />} />
            <Route path="/work-packages" element={<WorkPackages />} />
            <Route path="/departments/*" element={<Departments />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
