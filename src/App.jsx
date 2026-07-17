import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Monitoring from "./pages/Monitoring";
import Alerts from "./pages/Alerts";
import Billing from "./pages/Billing";
import RelayControl from "./pages/RelayControl";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="md:flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/relay-control" element={<RelayControl />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;