import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/auth/Login";
import PosScreen from "./pages/pos/PosScreen";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductsPage from "./pages/products/ProductsPage";
import SalesPage from "./pages/sales/SalesPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* POS (Admin + Cashier) */}
          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN", "CASHIER"]} />}
          >
            <Route path="/" element={<PosScreen />} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<Sidebar />}>
              <Route path="/pos" element={<PosScreen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
