import React, { useState } from "react";
import { Store, User, Lock, Eye, EyeOff, X } from "lucide-react";

const SettingsPage = () => {
  const TABS = [
    { id: "shop", label: "Shop Info", icon: Store },
    { id: "cashier", label: "Cashier Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

  const [activeTab, setActiveTab] = useState("shop");

  const [shopInfo, setShopInfo] = useState({
    shopName: "My Coffee Shop",
    trn: "123456789",
    address: "123 Business Street, City, State 12345",
    phone: "(123) 456-7890",
  });

  const [cashierInfo] = useState({
    username: "cashier@shop.com",
    email: "cashier@shop.com",
  });

  const [adminPassword, setAdminPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [cashierReset, setCashierReset] = useState({
    newPassword: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    adminCurrent: false,
    adminNew: false,
    adminConfirm: false,
    cashierNew: false,
    cashierConfirm: false,
  });

  const handleSaveShopInfo = () => {
    alert("Shop information saved successfully!");
  };

  const handleResetCashierPassword = () => {
    if (!cashierReset.newPassword || !cashierReset.confirm) {
      alert("Please fill in all fields");
      return;
    }
    if (cashierReset.newPassword !== cashierReset.confirm) {
      alert("Passwords do not match");
      return;
    }
    if (cashierReset.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    alert("Cashier password reset successfully!");
    setShowResetModal(false);
    setCashierReset({ newPassword: "", confirm: "" });
  };

  const handleUpdateAdminPassword = () => {
    if (
      !adminPassword.current ||
      !adminPassword.newPassword ||
      !adminPassword.confirm
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (adminPassword.newPassword !== adminPassword.confirm) {
      alert("New passwords do not match");
      return;
    }
    if (adminPassword.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    alert("Admin password updated successfully!");
    setAdminPassword({ current: "", newPassword: "", confirm: "" });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-text opacity-70">
            Manage your shop and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
    flex items-center gap-2
    px-2 pb-3
    text-lg font-semibold
    transition-colors
    border-b-2
    ${
      activeTab === id
        ? "border-secondary text-secondary"
        : "border-transparent text-slate-700 hover:text-primary"
    }
  `}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* SECTION 1: Shop Information */}
          {activeTab === "shop" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary bg-opacity-10 rounded-lg">
                    <Store className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className="text-xl font-bold text-primary">
                    Shop Information
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={shopInfo.shopName}
                    onChange={(e) =>
                      setShopInfo({ ...shopInfo, shopName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Enter shop name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    TRN (Tax Registration Number)
                  </label>
                  <input
                    type="text"
                    value={shopInfo.trn}
                    onChange={(e) =>
                      setShopInfo({ ...shopInfo, trn: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Enter TRN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Address
                  </label>
                  <textarea
                    value={shopInfo.address}
                    onChange={(e) =>
                      setShopInfo({ ...shopInfo, address: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Enter shop address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={shopInfo.phone}
                    onChange={(e) =>
                      setShopInfo({ ...shopInfo, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveShopInfo}
                    className="w-full sm:w-auto px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Save Shop Information
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Cashier Account */}
          {activeTab === "cashier" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 bg-opacity-10 rounded-lg">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-primary">
                    Cashier Account
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-text mb-3">
                    Cashier Login Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Username / Email
                      </label>
                      <input
                        type="text"
                        value={cashierInfo.email}
                        readOnly
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value="••••••••"
                        readOnly
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowResetModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  Reset Cashier Password
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: Change Admin Password */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 bg-opacity-10 rounded-lg">
                    <Lock className="w-5 h-5 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-primary">
                    Change Admin Password
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.adminCurrent ? "text" : "password"}
                      value={adminPassword.current}
                      onChange={(e) =>
                        setAdminPassword({
                          ...adminPassword,
                          current: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("adminCurrent")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.adminCurrent ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.adminNew ? "text" : "password"}
                      value={adminPassword.newPassword}
                      onChange={(e) =>
                        setAdminPassword({
                          ...adminPassword,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("adminNew")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.adminNew ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.adminConfirm ? "text" : "password"}
                      value={adminPassword.confirm}
                      onChange={(e) =>
                        setAdminPassword({
                          ...adminPassword,
                          confirm: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-12"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("adminConfirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.adminConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleUpdateAdminPassword}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Update Admin Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Cashier Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-primary">
                Reset Cashier Password
              </h2>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setCashierReset({ newPassword: "", confirm: "" });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.cashierNew ? "text" : "password"}
                    value={cashierReset.newPassword}
                    onChange={(e) =>
                      setCashierReset({
                        ...cashierReset,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("cashierNew")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.cashierNew ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.cashierConfirm ? "text" : "password"}
                    value={cashierReset.confirm}
                    onChange={(e) =>
                      setCashierReset({
                        ...cashierReset,
                        confirm: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("cashierConfirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.cashierConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setCashierReset({ newPassword: "", confirm: "" });
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleResetCashierPassword}
                className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
