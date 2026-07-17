import { Home, LineChart, Bell, Calculator, Power, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Overview", path: "/" },
  { icon: LineChart, label: "Monitoring", path: "/monitoring" },
 
  { icon: Calculator, label: "Billing", path: "/billing" },
  { icon: Power, label: "Relay Control", path: "/relay-control" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function Sidebar() {
  return (
    <aside className="w-56 bg-panel border-r border-white/5 min-h-screen p-4 flex flex-col gap-1">
      <div className="mb-6 px-2">
        <p className="text-copper font-display font-bold text-sm tracking-wide">
         
        </p>
        <p className="text-white/30 text-xs"></p>
      </div>

      {navItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={label}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
              isActive
                ? "bg-copper/10 text-copper border-l-2 border-copper"
                : "text-white/50 hover:bg-white/5 hover:text-white/80"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;