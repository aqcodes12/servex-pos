import React, { useState } from "react";
import {
  LayoutDashboard,
  Coffee,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import BrandLogo from "../assets/daily.png";
import Footer from "./Footer";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mainMenuItems = [
    { name: "POS", icon: LayoutDashboard },
    { name: "Menu", icon: Coffee },
    { name: "Orders", icon: ShoppingBag },
    { name: "Customers", icon: Users },
    { name: "Analytics Report", icon: BarChart3 },
  ];

  const otherItems = [{ name: "Advance Settings", icon: Settings }];

  const handleMenuClick = (itemName) => {
    setActiveItem(itemName);
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-600 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-bgColor transform transition-transform duration-300 ease-in-out 
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="px-6 py-8 flex items-center justify-center gap-3">
          <img src={BrandLogo} alt="Daily Cup" className="w-28 h-28" />
        </div>

        {/* Main Menu */}
        <div className="px-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-sm transition-colors ${
                    isActive
                      ? "bg-white text-primary border-l-4 border-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-primary" : "text-gray-400"
                    }`}
                  />
                  <span className="text-base font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Other Section */}
        <div className="px-6 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Others</h3>
          <nav className="space-y-1">
            {otherItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-primary border-l-4 border-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-primary" : "text-gray-400"
                    }`}
                  />
                  <span className="text-base font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 sm:ml-64 bg-bgColor min-h-screen">
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex flex-col min-h-[85vh]">
          {/* ✅ Header Section */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeItem}
            </h1>

            {/* Right - Search & User Info */}
            <div className="hidden sm:flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-50 p-2 rounded-full">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Zain Baig
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* ✅ Page Content Area */}
          <div className="flex-grow">
            <Outlet />
          </div>

          {/* ✅ Footer Section */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
