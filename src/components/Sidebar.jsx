// import React, { useState } from "react";
// import {
//   LayoutDashboard,
//   Coffee,
//   ShoppingBag,
//   BarChart3,
//   Settings,
//   Menu,
//   X,
//   Search,
//   Bell,
//   User,
//   LogOut,
// } from "lucide-react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import BrandLogo from "../assets/logo.png";
// import Footer from "./Footer";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const user = JSON.parse(localStorage.getItem("pos_user"));
//   const role = user?.role; // "admin" | "cashier"

//   const allMenuItems = [
//     {
//       name: "Dashboard",
//       icon: LayoutDashboard,
//       path: "/dashboard",
//       roles: ["admin"],
//     },
//     { name: "POS", icon: Coffee, path: "/pos", roles: ["admin", "cashier"] },
//     {
//       name: "Products",
//       icon: ShoppingBag,
//       path: "/products",
//       roles: ["admin"],
//     },
//     { name: "Sales", icon: BarChart3, path: "/sales", roles: ["admin"] },
//     { name: "Settings", icon: Settings, path: "/settings", roles: ["admin"] },
//   ];

//   const mainMenuItems = allMenuItems.filter((item) =>
//     item.roles.includes(role)
//   );

//   const activeItem =
//     mainMenuItems.find((item) =>
//       item.path === "/"
//         ? location.pathname === "/"
//         : location.pathname.startsWith(item.path)
//     )?.name || "POS";

//   const handleMenuClick = (item) => {
//     setIsSidebarOpen(false);
//     navigate(item.path);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login", { replace: true });
//   };

//   return (
//     <>
//       <div className="relative">
//         {/* Mobile Toggle Button */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           type="button"
//           className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-600 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
//         >
//           {isSidebarOpen ? (
//             <X className="w-6 h-6" />
//           ) : (
//             <Menu className="w-6 h-6" />
//           )}
//         </button>

//         {/* Sidebar */}
//         <aside
//           className={`fixed top-0 left-0 z-40 w-64 h-screen bg-bgColor transform transition-transform duration-300 ease-in-out
//         ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } sm:translate-x-0`}
//         >
//           {/* Logo Section */}
//           <div className="px-6 py-8 flex items-center justify-center gap-3">
//             <img
//               src={BrandLogo}
//               alt="Daily Cup"
//               className="h-28 w-auto object-contain"
//             />
//           </div>

//           {/* Main Menu */}
//           <div className="px-6 pb-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">
//               Main Menu
//             </h3>

//             <nav className="space-y-1">
//               {mainMenuItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = location.pathname === item.path;

//                 return (
//                   <button
//                     key={item.name}
//                     onClick={() => handleMenuClick(item)}
//                     className={`
//     w-full flex items-center gap-4
//     px-5 py-3
//     text-lg font-semibold
//     rounded-xl
//     transition-colors
//     ${
//       isActive
//         ? "bg-teal-50 text-teal-600 border-l-4 border-teal-500"
//         : "text-slate-700 hover:bg-slate-100"
//     }
//   `}
//                   >
//                     <Icon
//                       className={`w-6 h-6 ${
//                         isActive ? "text-teal-600" : "text-slate-400"
//                       }`}
//                     />
//                     {item.name}
//                   </button>
//                 );
//               })}

//               <button
//                 onClick={() => setShowLogoutConfirm(true)}
//                 className="
//     w-full flex items-center gap-4
//     px-5 py-3
//     text-lg font-semibold
//     rounded-xl
//     text-red-600
//     hover:bg-red-50
//     transition-colors
//   "
//               >
//                 <LogOut className="w-6 h-6" />
//                 Logout
//               </button>
//             </nav>
//           </div>
//           {/* Bottom Left User Info */}
//           <div className="absolute bottom-4 left-4 flex items-center gap-3">
//             <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center">
//               <User className="w-4 h-4 text-teal-600" />
//             </div>

//             <div className="flex flex-col leading-tight">
//               <span className="text-sm font-semibold text-slate-800">
//                 {user?.name || "User"}
//               </span>

//               <span
//                 className={`text-xs capitalize
//         ${role === "admin" ? "text-indigo-600" : "text-emerald-600"}`}
//               >
//                 {role}
//               </span>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <div className="p-4 sm:ml-64 bg-bgColor min-h-screen">
//           <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex flex-col min-h-[85vh]">
//             {/* Page Content */}
//             <div className="flex-grow">
//               <Outlet />
//             </div>

//             <Footer />
//           </div>
//         </div>
//       </div>
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">
//               Confirm Logout
//             </h2>
//             <p className="text-sm text-gray-600 mb-6">
//               Are you sure you want to logout?
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => {
//                   setShowLogoutConfirm(false);
//                   handleLogout();
//                 }}
//                 className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
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
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "../assets/full.png";
import Footer from "./Footer";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // desktop
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const user = JSON.parse(localStorage.getItem("pos_user"));
  const role = user?.role; // admin | cashier

  const allMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["admin"],
    },
    {
      name: "POS",
      icon: Coffee,
      path: "/pos",
      roles: ["admin", "cashier"],
    },
    {
      name: "Products",
      icon: ShoppingBag,
      path: "/products",
      roles: ["admin"],
    },
    {
      name: "Sales",
      icon: BarChart3,
      path: "/sales",
      roles: ["admin"],
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
      roles: ["admin"],
    },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  const handleMenuClick = (path) => {
    setIsSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="relative min-h-screen bg-bgColor">
        {/* Mobile Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="sm:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed bg-white top-0 left-0 z-40 h-screen bg-bgColor
            transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? "w-20" : "w-64"}
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0
          `}
        >
          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden sm:flex absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"
          >
            {isSidebarCollapsed ? <Menu /> : <X />}
          </button>

          {/* Logo */}
          <div className="px-6 py-8 flex justify-center">
            {!isSidebarCollapsed && (
              <img src={BrandLogo} alt="Logo" className="h-24 object-contain" />
            )}
          </div>

          {/* Menu */}
          <nav className="px-4 space-y-1">
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
                    py-3 rounded-xl font-semibold transition
                    ${
                      isActive
                        ? "bg-teal-50 text-teal-600"
                        : "text-slate-700 hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
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
                py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50
              `}
            >
              <LogOut className="w-6 h-6" />
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </nav>

          {/* User Info */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="w-4 h-4 text-teal-600" />
            </div>

            {!isSidebarCollapsed && (
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </p>
                <p className="text-xs capitalize text-slate-500">{role}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
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
            {role === "cashier" && <Footer />}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-[90%] max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">
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
