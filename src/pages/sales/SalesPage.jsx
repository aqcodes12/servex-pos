// import React, { useEffect, useMemo, useState } from "react";
// import { Eye, Printer, Search, X, Calendar } from "lucide-react";
// import axios from "axios";
// import MoneyValue from "../../components/MoneyValue";

// const SalesPage = () => {
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   const [showInvoice, setShowInvoice] = useState(false);
//   const [selectedSale, setSelectedSale] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("");

//   // ✅ pagination + filters for API
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   // ✅ optional: payment filter
//   const [paymentMode, setPaymentMode] = useState(""); // "UPI" | "CASH" | "CARD" etc
//   const [statusFilter, setStatusFilter] = useState("");
//   // "" | "PAID" | "CANCELLED" | "CANCEL_REQUESTED"

//   const posUser = JSON.parse(localStorage.getItem("pos_user"));
//   const business = posUser?.restaurant || {};
//   const role = posUser?.role; // "ADMIN" | "CASHIER"

//   const token = localStorage.getItem("token");

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setApiError("");

//       if (!token) {
//         setApiError("Token not found. Please login again.");
//         return;
//       }

//       // ✅ when date not selected use current month range (or you can change)
//       const today = new Date();

//       const startDate = new Date(today.getFullYear(), 0, 1)
//         .toISOString()
//         .split("T")[0]; // Jan 1 of current year
//       const endDate = dateFilter || today.toISOString().split("T")[0]; // today or selected date

//       const res = await axios.get("/order/get-all-orders", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           page,
//           pageSize,
//           startDate,
//           endDate,
//           ...(paymentMode ? { paymentMode } : {}),
//         },
//       });

//       const orders = res.data?.data || [];

//       const mapped = orders.map((o) => {
//         let derivedStatus = o.status;

//         if (o.status === "PAID" && o.cancelRequested) {
//           derivedStatus = "CANCEL_REQUESTED";
//         }

//         return {
//           id: o._id,
//           date: o.createdAt,
//           time: formatTime(o.createdAt),
//           invoiceNumber: o.invoiceNumber,
//           totalAmount: o.grandTotal,
//           paymentMode: o.paymentMode,

//           items: (o.items || []).map((it) => ({
//             name: it.name,
//             quantity: it.quantity,
//             price: it.sellingPrice,
//           })),

//           subtotal: o.subtotal,
//           taxAmount: o.taxAmount,
//           taxRate: o.taxRate,

//           status: derivedStatus, // ✅ FIXED
//         };
//       });

//       setSales(mapped);
//     } catch (err) {
//       setApiError(
//         err?.response?.data?.message || err?.message || "Failed to load orders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Load orders initially + when filters change
//   useEffect(() => {
//     fetchOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, dateFilter, paymentMode]);

//   const handlePreview = (sale) => {
//     setSelectedSale(sale);
//     setShowInvoice(true);
//   };

//   const handlePrint = (sale = selectedSale) => {
//     const printContent = document.getElementById("invoice-print-content");
//     const originalContent = document.body.innerHTML;

//     document.body.innerHTML = printContent.innerHTML;
//     window.print();
//     document.body.innerHTML = originalContent;
//     window.location.reload();
//   };

//   const handleCancelSale = async (sale) => {
//     try {
//       if (!sale?.id) return;

//       // prevent duplicate cancel
//       if (sale.status === "CANCELLED" || sale.status === "CANCEL_REQUESTED") {
//         alert("Order already cancelled or cancellation requested");
//         return;
//       }

//       const endpoint =
//         role === "ADMIN"
//           ? `/order/${sale.id}/cancel`
//           : `/order/${sale.id}/request-cancel`;

//       await axios.post(endpoint, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert(
//         role === "ADMIN"
//           ? "Order cancelled successfully"
//           : "Cancel request sent to admin",
//       );

//       // 🔄 refresh list
//       fetchOrders();
//     } catch (err) {
//       setApiError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to cancel order",
//       );
//     }
//   };

//   const filteredSales = useMemo(() => {
//     return sales.filter((sale) => {
//       const matchesSearch =
//         sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sale.paymentMode.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesDate = !dateFilter || sale.date?.slice(0, 10) === dateFilter;

//       const matchesStatus = !statusFilter || sale.status === statusFilter;

//       return matchesSearch && matchesDate && matchesStatus;
//     });
//   }, [sales, searchTerm, dateFilter, statusFilter]);

//   return (
//     <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-primary mb-2">
//             Sales History
//           </h1>
//           <p className="text-text opacity-70">
//             View and manage all transactions
//           </p>
//         </div>

//         {/* API Error */}
//         {apiError && (
//           <div className="mb-4 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg">
//             {apiError}
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-4 border-b border-gray-100">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search by invoice # or payment mode..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//                 />
//               </div>

//               <div className="relative sm:w-48">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="date"
//                   value={dateFilter}
//                   onChange={(e) => {
//                     setDateFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//                 />
//               </div>

//               {/* ✅ optional filter */}
//               <div className="sm:w-44">
//                 <select
//                   value={paymentMode}
//                   onChange={(e) => {
//                     setPaymentMode(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
//                 >
//                   <option value="">All Payments</option>
//                   <option value="UPI">UPI</option>
//                   <option value="CASH">Cash</option>
//                   <option value="CARD">Card</option>
//                 </select>
//               </div>

//               {/* Status filter */}
//               <div className="sm:w-48">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => {
//                     setStatusFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-lg
//       focus:outline-none focus:ring-2 focus:ring-secondary"
//                 >
//                   <option value="">All Status</option>
//                   <option value="PAID">Paid</option>
//                   <option value="CANCELLED">Cancelled</option>
//                   <option value="CANCEL_REQUESTED">Cancel Requested</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Loading */}
//           {loading ? (
//             <div className="text-center py-12 text-gray-500">
//               Loading sales...
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                         Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                         Invoice #
//                       </th>
//                       <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                         Total Amount
//                       </th>
//                       <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                         Payment Mode
//                       </th>
//                       <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-gray-100">
//                     {filteredSales.map((sale) => (
//                       <tr
//                         key={sale.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 text-lg font-semibold">
//                           <div className="font-medium">
//                             {formatDate(sale.date)}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {sale.time}
//                           </div>
//                         </td>

//                         <td className="px-6 py-4">
//                           <span className="font-mono text-base font-medium text-secondary">
//                             {sale.invoiceNumber}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4">
//                           <span className="font-semibold text-primary text-lg">
//                             <MoneyValue amount={sale.totalAmount} size={12} />
//                           </span>
//                         </td>

//                         <td className="px-6 py-4">
//                           <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-medium bg-blue-100 text-blue-700">
//                             {sale.paymentMode}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-medium bg-blue-100 text-blue-700">
//                             {sale.status}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handlePreview(sale)}
//                               className="flex items-center gap-1 px-3 py-2 text-secondary hover:bg-secondary hover:bg-opacity-10 rounded-lg transition-colors text-sm font-medium"
//                             >
//                               <Eye className="w-4 h-4" />
//                               Preview
//                             </button>

//                             <button
//                               onClick={() => {
//                                 setSelectedSale(sale);
//                                 setTimeout(() => handlePrint(sale), 100);
//                               }}
//                               className="flex items-center gap-1 px-3 py-2 text-accent hover:bg-accent hover:bg-opacity-10 rounded-lg transition-colors text-sm font-medium"
//                             >
//                               <Printer className="w-4 h-4" />
//                               Print
//                             </button>

//                             {sale.status !== "CANCELLED" &&
//                               (role === "ADMIN" ||
//                                 sale.status !== "CANCEL_REQUESTED") && (
//                                 <button
//                                   onClick={() => handleCancelSale(sale)}
//                                   className={`flex items-center gap-1 px-3 py-2 rounded-lg
//         transition-colors text-sm font-medium
//         ${
//           role === "ADMIN"
//             ? "text-red-600 hover:bg-red-600 hover:bg-opacity-10"
//             : "text-yellow-600 hover:bg-yellow-600 hover:bg-opacity-10"
//         }`}
//                                 >
//                                   <X className="w-4 h-4" />
//                                   {role === "ADMIN"
//                                     ? sale.status === "CANCEL_REQUESTED"
//                                       ? "Cancel"
//                                       : "Cancel"
//                                     : "Request Cancel"}
//                                 </button>
//                               )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {filteredSales.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   No sales records found
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* ✅ Invoice Modal */}
//       {showInvoice && selectedSale && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-2xl font-bold text-primary">
//                 Invoice Preview
//               </h2>
//               <button
//                 onClick={() => setShowInvoice(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             <div id="invoice-print-content" className="p-8">
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold text-primary mb-1">
//                   {business.name || "Business Name"}
//                 </h1>

//                 {business.address && (
//                   <p className="text-text opacity-70">{business.address}</p>
//                 )}

//                 {business.phone && (
//                   <p className="text-text opacity-70">
//                     Phone: {business.phone}
//                   </p>
//                 )}

//                 {business.trn && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     TRN: {business.trn}
//                   </p>
//                 )}
//               </div>

//               <div className="flex justify-between mb-8 pb-6 border-b-2 border-gray-200">
//                 <div>
//                   <p className="text-sm text-gray-500 mb-1">Invoice Number</p>
//                   <p className="font-mono font-bold text-lg text-secondary">
//                     {selectedSale.invoiceNumber}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-500 mb-1">Date & Time</p>
//                   <p className="font-medium text-text">
//                     {formatDate(selectedSale.date)}
//                   </p>
//                   <p className="text-sm text-gray-500">{selectedSale.time}</p>
//                 </div>
//               </div>

//               <div className="mb-8">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b-2 border-gray-200">
//                       <th className="text-left py-3 text-sm font-semibold text-primary">
//                         Item
//                       </th>
//                       <th className="text-center py-3 text-sm font-semibold text-primary">
//                         Qty
//                       </th>
//                       <th className="text-right py-3 text-sm font-semibold text-primary">
//                         Price
//                       </th>
//                       <th className="text-right py-3 text-sm font-semibold text-primary">
//                         Total
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedSale.items.map((item, index) => (
//                       <tr key={index} className="border-b border-gray-100">
//                         <td className="py-3 text-text">{item.name}</td>
//                         <td className="py-3 text-center text-text">
//                           {item.quantity}
//                         </td>
//                         <td className="py-3 text-right text-text">
//                           <MoneyValue amount={item.price} size={12} />
//                         </td>
//                         <td className="py-3 text-right font-medium text-text">
//                           <MoneyValue
//                             amount={item.quantity * item.price}
//                             size={12}
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="flex justify-end mb-8">
//                 <div className="w-64">
//                   <div className="flex justify-between py-2 border-t-2 border-gray-200">
//                     <span className="text-lg font-bold text-primary">
//                       Total Amount:
//                     </span>
//                     <span className="text-lg font-bold text-primary">
//                       <MoneyValue amount={selectedSale.totalAmount} size={14} />
//                     </span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-sm text-gray-500">Payment Mode:</span>
//                     <span className="text-sm font-medium text-blue-600">
//                       {selectedSale.paymentMode}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="text-center pt-6 border-t border-gray-200">
//                 <p className="text-text opacity-70 mb-2">
//                   Thank you for your business!
//                 </p>
//                 <p className="text-sm text-gray-500">Please visit again</p>
//               </div>
//             </div>

//             <div className="flex gap-3 p-6 border-t border-gray-200">
//               <button
//                 onClick={() => setShowInvoice(false)}
//                 className="flex-1 px-6 py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors font-medium"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => handlePrint()}
//                 className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
//               >
//                 <Printer className="w-5 h-5" />
//                 Print Invoice
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesPage;

import React, { useEffect, useMemo, useState } from "react";
import { Eye, Printer, Search, X, Calendar } from "lucide-react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";

const StatusBadge = ({ status }) => {
  const styles = {
    PAID: "bg-secondary/10 text-secondary",
    CANCELLED: "bg-red-100 text-red-600",
    CANCEL_REQUESTED: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const posUser = JSON.parse(localStorage.getItem("pos_user"));
  const business = posUser?.restaurant || {};
  const role = posUser?.role;

  const token = localStorage.getItem("token");

  /* ---------------- Helpers ---------------- */

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------------- API ---------------- */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setApiError("");

      const res = await axios.get("/order/get-all-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orders = res.data?.data || [];

      setSales(
        orders.map((o) => ({
          id: o._id,
          invoiceNumber: o.invoiceNumber,
          date: o.createdAt,
          time: formatTime(o.createdAt),
          totalAmount: o.grandTotal,
          paymentMode: o.paymentMode,
          status:
            o.status === "PAID" && o.cancelRequested
              ? "CANCEL_REQUESTED"
              : o.status,
          items: o.items || [],
        })),
      );
    } catch {
      setApiError("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- Filters ---------------- */

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      return (
        (!searchTerm ||
          s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!paymentMode || s.paymentMode === paymentMode) &&
        (!statusFilter || s.status === statusFilter)
      );
    });
  }, [sales, searchTerm, paymentMode, statusFilter]);

  /* ---------------- UI ---------------- */

  const handlePrint = (sale = selectedSale) => {
    const printContent = document.getElementById("invoice-print-content");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };
  const TAX_RATE = 5;

  const { subTotal, taxAmount, grandTotal } = useMemo(() => {
    if (!selectedSale) {
      return { subTotal: 0, taxAmount: 0, grandTotal: 0 };
    }

    const sub = selectedSale.items.reduce(
      (sum, item) => sum + item.sellingPrice * item.quantity,
      0,
    );

    const tax = (sub * TAX_RATE) / 100;

    return {
      subTotal: sub,
      taxAmount: tax,
      grandTotal: sub + tax,
    };
  }, [selectedSale]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Sales History</h1>
          <p className="text-sm text-text/70 mt-1">
            View and manage all transactions
          </p>
        </div>

        {/* Error */}
        {apiError && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search invoice…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
            />
          </div>

          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Payments</option>
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="CANCEL_REQUESTED">Cancel Requested</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl overflow-hidden">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="px-6 py-4 flex justify-between animate-pulse"
                >
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="p-12 text-center text-text/60">
              No sales recorded yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-background border-b">
                <tr className="text-text/70">
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Invoice</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Payment</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-background">
                    <td className="px-6 py-4">
                      <div className="font-medium">{formatDate(s.date)}</div>
                      <div className="text-xs text-text/60">{s.time}</div>
                    </td>

                    <td className="px-6 py-4 font-mono text-secondary">
                      {s.invoiceNumber}
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      <MoneyValue amount={s.totalAmount} size={12} />
                    </td>

                    <td className="px-6 py-4">{s.paymentMode}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={s.status} />
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedSale(s);
                          setShowInvoice(true);
                        }}
                        className="inline-flex items-center gap-1 text-secondary hover:bg-secondary/10 px-3 py-1.5 rounded-lg"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ✅ Invoice Modal */}
      {showInvoice && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-primary">
                Invoice Preview
              </h2>
              <button
                onClick={() => setShowInvoice(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div id="invoice-print-content" className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary mb-1">
                  {business.name || "Business Name"}
                </h1>

                {business.address && (
                  <p className="text-text opacity-70">{business.address}</p>
                )}

                {business.phone && (
                  <p className="text-text opacity-70">
                    Phone: {business.phone}
                  </p>
                )}

                {business.trn && (
                  <p className="text-xs text-gray-500 mt-1">
                    TRN: {business.trn}
                  </p>
                )}
              </div>

              <div className="flex justify-between mb-8 pb-6 border-b-2 border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Invoice Number</p>
                  <p className="font-mono font-bold text-lg text-secondary">
                    {selectedSale.invoiceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                  <p className="font-medium text-text">
                    {formatDate(selectedSale.date)}
                  </p>
                  <p className="text-sm text-gray-500">{selectedSale.time}</p>
                </div>
              </div>

              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 text-sm font-semibold text-primary">
                        Item
                      </th>
                      <th className="text-center py-3 text-sm font-semibold text-primary">
                        Qty
                      </th>
                      <th className="text-right py-3 text-sm font-semibold text-primary">
                        Price
                      </th>
                      <th className="text-right py-3 text-sm font-semibold text-primary">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-text">{item.name}</td>
                        <td className="py-3 text-center text-text">
                          {item.quantity}
                        </td>
                        <td className="py-3 text-right text-text">
                          <MoneyValue amount={item.sellingPrice} size={12} />
                        </td>
                        <td className="py-3 text-right font-medium text-text">
                          <MoneyValue
                            amount={item.quantity * item.sellingPrice}
                            size={12}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-64 space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between text-sm text-text">
                  <span>Subtotal</span>
                  <MoneyValue amount={subTotal} size={12} />
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm text-text">
                  <span>Tax ({TAX_RATE}%)</span>
                  <MoneyValue amount={taxAmount} size={12} />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 my-2" />

                {/* Grand Total */}
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total Amount</span>
                  <MoneyValue amount={grandTotal} size={14} />
                </div>

                {/* Payment Mode */}
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-500">Payment Mode:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {selectedSale.paymentMode}
                  </span>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-text opacity-70 mb-2">
                  Thank you for your business!
                </p>
                <p className="text-sm text-gray-500">Please visit again</p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowInvoice(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => handlePrint()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                <Printer className="w-5 h-5" />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
