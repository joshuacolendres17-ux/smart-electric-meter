import { Home, LineChart, Bell, Calculator, Power, Settings, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Overview", path: "/" },
  { icon: LineChart, label: "Monitoring", path: "/monitoring" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: Calculator, label: "Billing", path: "/billing" },
  { icon: Power, label: "Relay Control", path: "/relay-control" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar with hamburger button */}
      <div className="md:hidden flex items-center justify-between bg-panel border-b border-white/5 px-4 py-3">
        <p className="text-copper font-display font-bold text-sm tracking-wide">
          SEM CONTROL
        </p>
        <button onClick={() => setOpen(true)} className="text-white/70">
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay behind mobile menu */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar itself */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-56 bg-panel border-r border-white/5 p-4 flex flex-col gap-1 z-50 transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <p className="text-copper font-display font-bold text-sm tracking-wide">
              SEM CONTROL
            </p>
            <p className="text-white/30 text-xs">v1.0</p>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden text-white/50">
            <X size={20} />
          </button>
        </div>

        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            onClick={() => setOpen(false)}
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
    </>
  );
}

export default Sidebar;