import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/auth/Login";
import LoginPage from "./pages/auth/Login";
import PosScreen from "./pages/pos/PosScreen";

function App() {
  return (
    <>
      <div className="min-h-screen bg-background text-text font-sans">
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Sidebar />}>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/" element={<PosScreen />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
