import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Coffee,
  ShoppingBag,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  FileStack,
  Calculator,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "../assets/flogo.png";
import Footer from "./Footer";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const user = JSON.parse(localStorage.getItem("pos_user") || "{}");
  const role = user?.role; // ADMIN | CASHIER

  const [screen, setScreen] = useState("desktop");

  useEffect(() => {
    const detectScreen = () => {
      const w = window.innerWidth;

      if (w < 640) setScreen("mobile");
      else if (w < 1024) setScreen("tablet");
      else setScreen("desktop");
    };

    detectScreen();
    window.addEventListener("resize", detectScreen);
    return () => window.removeEventListener("resize", detectScreen);
  }, []);

  const allMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["ADMIN"],
    },
    {
      name: "POS",
      icon: Calculator,
      path: "/pos",
      roles: ["ADMIN", "CASHIER"],
    },
    {
      name: "Products",
      icon: ShoppingBag,
      path: "/products",
      roles: ["ADMIN"],
    },
    {
      name: "Categories",
      icon: FileStack,
      path: "/categories",
      roles: ["ADMIN"],
    },
    {
      name: "Sales",
      icon: BarChart3,
      path: "/sales",
      roles: ["ADMIN"],
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      roles: ["ADMIN"],
    },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  // const handleMenuClick = (path) => {
  //   // Only close overlay on mobile
  //   if (screen === "mobile") {
  //     setIsSidebarOpen(false);
  //   }

  //   // Tablet & desktop: just navigate
  //   navigate(path);
  // };

  const handleMenuClick = (path) => {
    if (screen === "mobile") {
      setIsSidebarOpen(false);
    }

    // Desktop behavior
    if (screen === "desktop") {
      if (path.startsWith("/pos")) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    }

    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // // Auto-collapse sidebar on POS

  // useEffect(() => {
  //   // Initial load OR when route changes

  //   // POS → collapsed for ALL screens
  //   if (location.pathname.startsWith("/pos")) {
  //     setIsSidebarCollapsed(true);
  //     return;
  //   }

  //   // Tablet → always collapsed
  //   if (screen === "tablet") {
  //     setIsSidebarCollapsed(true);
  //     return;
  //   }

  //   // Desktop → keep user preference (do nothing)
  // }, [location.pathname, screen]);

  useEffect(() => {
    // POS → always collapsed
    if (location.pathname.startsWith("/pos")) {
      setIsSidebarCollapsed(true);
      return;
    }

    // Tablet → always collapsed
    if (screen === "tablet") {
      setIsSidebarCollapsed(true);
      return;
    }

    // Desktop → expand for non-POS routes
    if (screen === "desktop") {
      setIsSidebarCollapsed(false);
    }
  }, [location.pathname, screen]);

  return (
    <>
      <div className="relative min-h-screen bg-background">
        <aside
          className={`
            fixed top-0 left-0 z-40 h-screen bg-white
            border-r border-slate-200
            transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? "w-20" : "w-64"}
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0
          `}
        >
          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            className="hidden sm:flex absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"
          >
            {isSidebarCollapsed ? <Menu /> : <X />}
          </button>

          {/* Logo */}
          <div className="px-6 py-8 flex justify-center">
            {!isSidebarCollapsed && (
              <img src={BrandLogo} alt="Logo" className="h-20 object-contain" />
            )}
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.path)}
                  className={`
                    w-full flex items-center
                    ${isSidebarCollapsed ? "justify-center" : "gap-4 px-4"}
                    py-3 rounded-xl text-sm font-semibold transition
                    ${
                      isActive
                        ? "bg-secondary/10 text-secondary"
                        : "text-text hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`
                w-full flex items-center
                ${isSidebarCollapsed ? "justify-center" : "gap-4 px-4"}
                py-3 rounded-xl text-sm font-semibold
                text-red-600 hover:bg-red-50
              `}
            >
              <LogOut className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </nav>

          {/* User info */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-secondary" />
            </div>

            {!isSidebarCollapsed && (
              <div className="leading-tight">
                <p className="text-sm font-semibold text-primary">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {role?.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div
          className={`
            transition-all duration-300
            ${isSidebarCollapsed ? "sm:ml-20" : "sm:ml-64"}
            p-4
          `}
        >
          <div className="bg-white min-h-[85vh] rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex-grow">
              <Outlet />
            </div>
            {role === "CASHIER" && <Footer />}
          </div>
        </div>
      </div>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-[90%] max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
