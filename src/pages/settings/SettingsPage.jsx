// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Store, User, Lock, Eye, EyeOff, X } from "lucide-react";

// const SettingsPage = () => {
//   const token = localStorage.getItem("token");

//   const TABS = [
//     { id: "shop", label: "Shop Info", icon: Store },
//     { id: "cashier", label: "Cashier Account", icon: User },
//     { id: "security", label: "Security", icon: Lock },
//   ];

//   const [activeTab, setActiveTab] = useState("shop");

//   const [loadingShop, setLoadingShop] = useState(false);
//   const [savingShop, setSavingShop] = useState(false);
//   const [apiError, setApiError] = useState("");

//   // ✅ Shop info from API
//   const [shopInfo, setShopInfo] = useState({
//     shopName: "",
//     country: "INDIA",
//     taxNumber: "",
//     address: "",
//     phone: "",
//   });

//   // ✅ security
//   const [adminPassword, setAdminPassword] = useState({
//     current: "",
//     newPassword: "",
//     confirm: "",
//   });

//   const [cashierReset, setCashierReset] = useState({
//     email: "",
//     newPassword: "",
//     confirm: "",
//   });

//   const [showPasswords, setShowPasswords] = useState({
//     adminCurrent: false,
//     adminNew: false,
//     adminConfirm: false,
//     cashierNew: false,
//     cashierConfirm: false,
//   });

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   // ✅ tax label based on country
//   const taxLabel =
//     shopInfo?.country?.toUpperCase() === "SAUDI" ? "VAT Number" : "GST Number";

//   // ------------------ APIs ------------------

//   const fetchSettings = async () => {
//     try {
//       setLoadingShop(true);
//       setApiError("");

//       if (!token) {
//         setApiError("Token not found. Please login again.");
//         return;
//       }

//       const res = await axios.get("/setting/get-settings", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = res.data?.data;

//       setShopInfo({
//         shopName: data?.shopName ?? "",
//         country: data?.country ?? "INDIA",
//         taxNumber: data?.taxNumber ?? "",
//         address: data?.address ?? "",
//         phone: data?.phone ?? "",
//       });
//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Failed to load settings");
//     } finally {
//       setLoadingShop(false);
//     }
//   };

//   const handleSaveShopInfo = async () => {
//     try {
//       setSavingShop(true);
//       setApiError("");

//       if (!token) {
//         setApiError("Token not found. Please login again.");
//         return;
//       }

//       // ✅ validation
//       if (!shopInfo.shopName || !shopInfo.address || !shopInfo.phone) {
//         setApiError("Please fill required fields (Shop name, Address, Phone)");
//         return;
//       }

//       const payload = {
//         shopName: shopInfo.shopName,
//         country: shopInfo.country,
//         taxNumber: shopInfo.taxNumber,
//         address: shopInfo.address,
//         phone: shopInfo.phone,
//       };

//       await axios.patch("/setting/update-settings", payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert("Shop information saved successfully!");
//       fetchSettings();
//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Failed to update settings");
//     } finally {
//       setSavingShop(false);
//     }
//   };

//   const handleUpdateAdminPassword = async () => {
//     try {
//       setApiError("");

//       if (!token) {
//         setApiError("Token not found. Please login again.");
//         return;
//       }

//       if (
//         !adminPassword.current ||
//         !adminPassword.newPassword ||
//         !adminPassword.confirm
//       ) {
//         setApiError("Please fill in all fields");
//         return;
//       }

//       if (adminPassword.newPassword !== adminPassword.confirm) {
//         setApiError("New passwords do not match");
//         return;
//       }

//       await axios.patch(
//         "/user/change-password",
//         {
//           currentPassword: adminPassword.current,
//           newPassword: adminPassword.newPassword,
//           confirmPassword: adminPassword.confirm,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       alert("Admin password updated successfully!");
//       setAdminPassword({ current: "", newPassword: "", confirm: "" });
//     } catch (err) {
//       setApiError(err?.response?.data?.msg || "Failed to update password");
//     }
//   };

//   const handleResetCashierPassword = async (e) => {
//     e.preventDefault();

//     try {
//       setApiError("");

//       if (!token) {
//         setApiError("Token not found. Please login again.");
//         return;
//       }

//       if (
//         !cashierReset.email ||
//         !cashierReset.newPassword ||
//         !cashierReset.confirm
//       ) {
//         setApiError("Please fill in all fields");
//         return;
//       }

//       if (cashierReset.newPassword !== cashierReset.confirm) {
//         setApiError("Passwords do not match");
//         return;
//       }

//       // ✅ IMPORTANT: curl says POST (not PATCH)
//       await axios.post(
//         "/user/reset-password",
//         {
//           email: cashierReset.email,
//           newPassword: cashierReset.newPassword,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       alert("Cashier password reset successfully!");
//       setCashierReset({ email: "", newPassword: "", confirm: "" });
//     } catch (err) {
//       setApiError(err?.response?.data?.message || "Failed to reset password");
//     }
//   };

//   // ------------------ load settings ------------------
//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
//           <p className="text-text opacity-70">
//             Manage your shop and account settings
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="mb-6 border-b border-gray-200">
//           <div className="flex gap-6">
//             {TABS.map(({ id, label, icon: Icon }) => (
//               <button
//                 key={id}
//                 onClick={() => setActiveTab(id)}
//                 className={`
//                   flex items-center gap-2
//                   px-2 pb-3
//                   text-lg font-semibold
//                   transition-colors
//                   border-b-2
//                   ${
//                     activeTab === id
//                       ? "border-secondary text-secondary"
//                       : "border-transparent text-slate-700 hover:text-primary"
//                   }
//                 `}
//               >
//                 <Icon className="w-5 h-5" />
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-6">
//           {/* SHOP INFO */}
//           {activeTab === "shop" && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-secondary bg-opacity-10 rounded-lg">
//                     <Store className="w-5 h-5 text-secondary" />
//                   </div>
//                   <h2 className="text-xl font-bold text-primary">
//                     Shop Information
//                   </h2>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 {loadingShop ? (
//                   <div className="text-gray-500">Loading settings...</div>
//                 ) : (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-text mb-2">
//                         Shop Name
//                       </label>
//                       <input
//                         type="text"
//                         value={shopInfo.shopName}
//                         onChange={(e) =>
//                           setShopInfo({ ...shopInfo, shopName: e.target.value })
//                         }
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//                         placeholder="Enter shop name"
//                       />
//                     </div>

//                     {/* ✅ Country */}
//                     <div>
//                       <label className="block text-sm font-medium text-text mb-2">
//                         Country
//                       </label>
//                       <select
//                         value={shopInfo.country}
//                         onChange={(e) =>
//                           setShopInfo({
//                             ...shopInfo,
//                             country: e.target.value,
//                           })
//                         }
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                       >
//                         <option value="INDIA">INDIA</option>
//                         <option value="SAUDI">SAUDI</option>
//                       </select>
//                     </div>

//                     {/* ✅ GST / VAT dynamic */}
//                     <div>
//                       <label className="block text-sm font-medium text-text mb-2">
//                         {taxLabel}
//                       </label>
//                       <input
//                         type="text"
//                         value={shopInfo.taxNumber}
//                         onChange={(e) =>
//                           setShopInfo({
//                             ...shopInfo,
//                             taxNumber: e.target.value,
//                           })
//                         }
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//                         placeholder={`Enter ${taxLabel}`}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-text mb-2">
//                         Address
//                       </label>
//                       <textarea
//                         value={shopInfo.address}
//                         onChange={(e) =>
//                           setShopInfo({ ...shopInfo, address: e.target.value })
//                         }
//                         rows="3"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//                         placeholder="Enter shop address"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-text mb-2">
//                         Phone
//                       </label>
//                       <input
//                         type="tel"
//                         value={shopInfo.phone}
//                         onChange={(e) =>
//                           setShopInfo({ ...shopInfo, phone: e.target.value })
//                         }
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//                         placeholder="Enter phone number"
//                       />
//                     </div>

//                     <div className="pt-2">
//                       <button
//                         onClick={handleSaveShopInfo}
//                         disabled={savingShop}
//                         className="w-full sm:w-auto px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-60"
//                       >
//                         {savingShop ? "Saving..." : "Save Shop Information"}
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* CASHIER ACCOUNT */}
//           {activeTab === "cashier" && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-500 bg-opacity-10 rounded-lg">
//                     <User className="w-5 h-5 text-blue-500" />
//                   </div>
//                   <h2 className="text-xl font-bold text-primary">
//                     Cashier Account
//                   </h2>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <form
//                   onSubmit={handleResetCashierPassword}
//                   className="space-y-4"
//                 >
//                   {/* Email */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={cashierReset.email}
//                       onChange={(e) =>
//                         setCashierReset({
//                           ...cashierReset,
//                           email: e.target.value,
//                         })
//                       }
//                       placeholder="Enter cashier email"
//                       className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
//                     />
//                   </div>

//                   {/* New Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPasswords.cashierNew ? "text" : "password"}
//                         value={cashierReset.newPassword}
//                         onChange={(e) =>
//                           setCashierReset({
//                             ...cashierReset,
//                             newPassword: e.target.value,
//                           })
//                         }
//                         placeholder="Enter new password"
//                         className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 pr-12"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePasswordVisibility("cashierNew")}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                       >
//                         {showPasswords.cashierNew ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Confirm Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={
//                           showPasswords.cashierConfirm ? "text" : "password"
//                         }
//                         value={cashierReset.confirm}
//                         onChange={(e) =>
//                           setCashierReset({
//                             ...cashierReset,
//                             confirm: e.target.value,
//                           })
//                         }
//                         placeholder="Confirm new password"
//                         className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 pr-12"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           togglePasswordVisibility("cashierConfirm")
//                         }
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                       >
//                         {showPasswords.cashierConfirm ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex gap-3 pt-2">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setCashierReset({
//                           email: "",
//                           newPassword: "",
//                           confirm: "",
//                         })
//                       }
//                       className="flex-1 px-6 py-3 border border-gray-300 rounded-lg"
//                     >
//                       Clear
//                     </button>

//                     <button
//                       type="submit"
//                       className="flex-1 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
//                     >
//                       Reset Password
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

//           {/* SECURITY */}
//           {activeTab === "security" && (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-red-500 bg-opacity-10 rounded-lg">
//                     <Lock className="w-5 h-5 text-red-500" />
//                   </div>
//                   <h2 className="text-xl font-bold text-primary">
//                     Change Admin Password
//                   </h2>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 {/* Current */}
//                 <div>
//                   <label className="block text-sm font-medium text-text mb-2">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.adminCurrent ? "text" : "password"}
//                       value={adminPassword.current}
//                       onChange={(e) =>
//                         setAdminPassword({
//                           ...adminPassword,
//                           current: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("adminCurrent")}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     >
//                       {showPasswords.adminCurrent ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//                 {apiError && <p className="text-red-500">{apiError}</p>}

//                 {/* New */}
//                 <div>
//                   <label className="block text-sm font-medium text-text mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.adminNew ? "text" : "password"}
//                       value={adminPassword.newPassword}
//                       onChange={(e) =>
//                         setAdminPassword({
//                           ...adminPassword,
//                           newPassword: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("adminNew")}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     >
//                       {showPasswords.adminNew ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm */}
//                 <div>
//                   <label className="block text-sm font-medium text-text mb-2">
//                     Confirm New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPasswords.adminConfirm ? "text" : "password"}
//                       value={adminPassword.confirm}
//                       onChange={(e) =>
//                         setAdminPassword({
//                           ...adminPassword,
//                           confirm: e.target.value,
//                         })
//                       }
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("adminConfirm")}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     >
//                       {showPasswords.adminConfirm ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   <button
//                     onClick={handleUpdateAdminPassword}
//                     className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg"
//                   >
//                     Update Admin Password
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Store, User, Lock, Eye, EyeOff } from "lucide-react";

const SettingsPage = () => {
  const token = localStorage.getItem("token");

  const TABS = [
    { id: "shop", label: "Shop Info", icon: Store },
    { id: "cashier", label: "Cashier Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

  const [activeTab, setActiveTab] = useState("shop");

  const [loadingShop, setLoadingShop] = useState(false);
  const [savingShop, setSavingShop] = useState(false);
  const [apiError, setApiError] = useState("");

  const [shopInfo, setShopInfo] = useState({
    shopName: "",
    country: "INDIA",
    taxNumber: "",
    address: "",
    phone: "",
  });

  const [adminPassword, setAdminPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [cashierReset, setCashierReset] = useState({
    email: "",
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords((p) => ({ ...p, [field]: !p[field] }));
  };

  const taxLabel =
    shopInfo.country?.toUpperCase() === "SAUDI" ? "VAT Number" : "GST Number";

  /* ---------------- APIs (unchanged) ---------------- */

  const fetchSettings = async () => {
    try {
      setLoadingShop(true);
      setApiError("");

      const res = await axios.get("/setting/get-settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = res.data?.data;
      setShopInfo({
        shopName: d?.shopName ?? "",
        country: d?.country ?? "INDIA",
        taxNumber: d?.taxNumber ?? "",
        address: d?.address ?? "",
        phone: d?.phone ?? "",
      });
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to load settings");
    } finally {
      setLoadingShop(false);
    }
  };

  const handleSaveShopInfo = async () => {
    try {
      setSavingShop(true);
      setApiError("");

      if (!shopInfo.shopName || !shopInfo.address || !shopInfo.phone) {
        setApiError("Please fill required fields (Shop name, Address, Phone)");
        return;
      }

      await axios.patch(
        "/setting/update-settings",
        {
          shopName: shopInfo.shopName,
          country: shopInfo.country,
          taxNumber: shopInfo.taxNumber,
          address: shopInfo.address,
          phone: shopInfo.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Shop information saved successfully!");
      fetchSettings();
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to update settings");
    } finally {
      setSavingShop(false);
    }
  };

  const handleUpdateAdminPassword = async () => {
    try {
      setApiError("");

      if (
        !adminPassword.current ||
        !adminPassword.newPassword ||
        !adminPassword.confirm
      ) {
        setApiError("Please fill in all fields");
        return;
      }

      if (adminPassword.newPassword !== adminPassword.confirm) {
        setApiError("New passwords do not match");
        return;
      }

      await axios.patch(
        "/user/change-password",
        {
          currentPassword: adminPassword.current,
          newPassword: adminPassword.newPassword,
          confirmPassword: adminPassword.confirm,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Admin password updated successfully!");
      setAdminPassword({ current: "", newPassword: "", confirm: "" });
    } catch (err) {
      setApiError(err?.response?.data?.msg || "Failed to update password");
    }
  };

  const handleResetCashierPassword = async (e) => {
    e.preventDefault();

    try {
      setApiError("");

      if (
        !cashierReset.email ||
        !cashierReset.newPassword ||
        !cashierReset.confirm
      ) {
        setApiError("Please fill in all fields");
        return;
      }

      if (cashierReset.newPassword !== cashierReset.confirm) {
        setApiError("Passwords do not match");
        return;
      }

      await axios.post(
        "/user/reset-password",
        {
          email: cashierReset.email,
          newPassword: cashierReset.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Cashier password reset successfully!");
      setCashierReset({ email: "", newPassword: "", confirm: "" });
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to reset password");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="mt-1 text-sm text-text/70">
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
                  pb-3 text-sm font-semibold
                  border-b-2 transition-colors
                  ${
                    activeTab === id
                      ? "border-secondary text-secondary"
                      : "border-transparent text-text/70 hover:text-primary"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-600">
            {apiError}
          </div>
        )}

        <div className="space-y-6">
          {/* SHOP INFO */}
          {activeTab === "shop" && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Store className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-lg font-semibold text-primary">
                  Shop Information
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {loadingShop ? (
                  <p className="text-text/60">Loading settings…</p>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-text mb-1 block">
                        Shop Name
                      </label>
                      <input
                        value={shopInfo.shopName}
                        onChange={(e) =>
                          setShopInfo({ ...shopInfo, shopName: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text mb-1 block">
                        Country
                      </label>
                      <select
                        value={shopInfo.country}
                        onChange={(e) =>
                          setShopInfo({
                            ...shopInfo,
                            country: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      >
                        <option value="INDIA">INDIA</option>
                        <option value="SAUDI">SAUDI</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text mb-1 block">
                        {taxLabel}
                      </label>
                      <input
                        value={shopInfo.taxNumber}
                        onChange={(e) =>
                          setShopInfo({
                            ...shopInfo,
                            taxNumber: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text mb-1 block">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        value={shopInfo.address}
                        onChange={(e) =>
                          setShopInfo({
                            ...shopInfo,
                            address: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text mb-1 block">
                        Phone
                      </label>
                      <input
                        value={shopInfo.phone}
                        onChange={(e) =>
                          setShopInfo({ ...shopInfo, phone: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <button
                      onClick={handleSaveShopInfo}
                      disabled={savingShop}
                      className="mt-2 inline-flex px-6 py-3 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 disabled:opacity-60"
                    >
                      {savingShop ? "Saving…" : "Save Shop Information"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* CASHIER ACCOUNT */}
          {activeTab === "cashier" && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold text-primary">
                  Cashier Account
                </h2>
              </div>

              <form
                onSubmit={handleResetCashierPassword}
                className="p-6 space-y-4"
              >
                {["email", "newPassword", "confirm"].map((field) => (
                  <div key={field} className="relative">
                    <label className="text-sm font-medium text-text mb-1 block">
                      {field === "email"
                        ? "Email"
                        : field === "newPassword"
                          ? "New Password"
                          : "Confirm Password"}
                    </label>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : showPasswords[
                                field === "newPassword"
                                  ? "cashierNew"
                                  : "cashierConfirm"
                              ]
                            ? "text"
                            : "password"
                      }
                      value={cashierReset[field]}
                      onChange={(e) =>
                        setCashierReset({
                          ...cashierReset,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12"
                    />
                    {field !== "email" && (
                      <button
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility(
                            field === "newPassword"
                              ? "cashierNew"
                              : "cashierConfirm",
                          )
                        }
                        className="absolute right-3 top-9 text-gray-400"
                      >
                        {showPasswords[
                          field === "newPassword"
                            ? "cashierNew"
                            : "cashierConfirm"
                        ] ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCashierReset({
                        email: "",
                        newPassword: "",
                        confirm: "",
                      })
                    }
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Lock className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-primary">
                  Change Admin Password
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {["current", "newPassword", "confirm"].map((field) => (
                  <div key={field} className="relative">
                    <label className="text-sm font-medium text-text mb-1 block">
                      {field === "current"
                        ? "Current Password"
                        : field === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"}
                    </label>
                    <input
                      type={
                        showPasswords[
                          field === "current"
                            ? "adminCurrent"
                            : field === "newPassword"
                              ? "adminNew"
                              : "adminConfirm"
                        ]
                          ? "text"
                          : "password"
                      }
                      value={adminPassword[field]}
                      onChange={(e) =>
                        setAdminPassword({
                          ...adminPassword,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility(
                          field === "current"
                            ? "adminCurrent"
                            : field === "newPassword"
                              ? "adminNew"
                              : "adminConfirm",
                        )
                      }
                      className="absolute right-3 top-9 text-gray-400"
                    >
                      {showPasswords[
                        field === "current"
                          ? "adminCurrent"
                          : field === "newPassword"
                            ? "adminNew"
                            : "adminConfirm"
                      ] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleUpdateAdminPassword}
                  className="mt-2 px-6 py-3 rounded-lg bg-primary text-white font-medium"
                >
                  Update Admin Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
