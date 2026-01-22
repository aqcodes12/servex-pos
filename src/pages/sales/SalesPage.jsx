// import React, { useState } from "react";
// import { Eye, Printer, Search, X, Calendar } from "lucide-react";
// import MoneyValue from "../../components/MoneyValue";

// const SalesPage = () => {
//   const [sales] = useState([
//     {
//       id: 1,
//       date: "2026-01-02",
//       time: "10:30 AM",
//       invoiceNumber: "INV-2026-001",
//       totalAmount: 23.5,
//       paymentMode: "Cash",
//       items: [
//         { name: "Espresso", quantity: 2, price: 3.5 },
//         { name: "Cappuccino", quantity: 1, price: 4.5 },
//         { name: "Croissant", quantity: 3, price: 3.0 },
//       ],
//     },
//     {
//       id: 2,
//       date: "2026-01-02",
//       time: "11:15 AM",
//       invoiceNumber: "INV-2026-002",
//       totalAmount: 15.0,
//       paymentMode: "Card",
//       items: [
//         { name: "Cappuccino", quantity: 2, price: 4.5 },
//         { name: "Croissant", quantity: 2, price: 3.0 },
//       ],
//     },
//     {
//       id: 3,
//       date: "2026-01-02",
//       time: "12:45 PM",
//       invoiceNumber: "INV-2026-003",
//       totalAmount: 42.0,
//       paymentMode: "Cash",
//       items: [
//         { name: "Espresso", quantity: 4, price: 3.5 },
//         { name: "Cappuccino", quantity: 3, price: 4.5 },
//         { name: "Croissant", quantity: 5, price: 3.0 },
//       ],
//     },
//     {
//       id: 4,
//       date: "2026-01-01",
//       time: "02:30 PM",
//       invoiceNumber: "INV-2026-004",
//       totalAmount: 31.5,
//       paymentMode: "Card",
//       items: [
//         { name: "Cappuccino", quantity: 5, price: 4.5 },
//         { name: "Croissant", quantity: 2, price: 3.0 },
//       ],
//     },
//   ]);

//   const [showInvoice, setShowInvoice] = useState(false);
//   const [selectedSale, setSelectedSale] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("");

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

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const filteredSales = sales.filter((sale) => {
//     const matchesSearch =
//       sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sale.paymentMode.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesDate = !dateFilter || sale.date === dateFilter;

//     return matchesSearch && matchesDate;
//   });

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
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Date
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Invoice #
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Total Amount
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Payment Mode
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {filteredSales.map((sale) => (
//                   <tr
//                     key={sale.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="px-6 py-4 text-lg font-semibold">
//                       <div className="font-medium">{formatDate(sale.date)}</div>
//                       <div className="text-sm text-gray-500">{sale.time}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="font-mono text-base font-medium text-secondary">
//                         {sale.invoiceNumber}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="font-semibold text-primary text-lg">
//                         <MoneyValue amount={sale.totalAmount} size={12} />
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${
//                           sale.paymentMode === "Cash"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                       >
//                         {sale.paymentMode}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handlePreview(sale)}
//                           className="flex items-center gap-1 px-3 py-2 text-secondary hover:bg-secondary hover:bg-opacity-10 rounded-lg transition-colors text-sm font-medium"
//                         >
//                           <Eye className="w-4 h-4" />
//                           Preview
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedSale(sale);
//                             setTimeout(() => handlePrint(sale), 100);
//                           }}
//                           className="flex items-center gap-1 px-3 py-2 text-accent hover:bg-accent hover:bg-opacity-10 rounded-lg transition-colors text-sm font-medium"
//                         >
//                           <Printer className="w-4 h-4" />
//                           Print
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredSales.length === 0 && (
//             <div className="text-center py-12 text-gray-500">
//               No sales records found
//             </div>
//           )}
//         </div>
//       </div>

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
//                 <h1 className="text-3xl font-bold text-primary mb-2">
//                   Your Business Name
//                 </h1>
//                 <p className="text-text opacity-70">
//                   123 Business Street, City, State 12345
//                 </p>
//                 <p className="text-text opacity-70">Phone: (123) 456-7890</p>
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
//                     <span
//                       className={`text-sm font-medium ${
//                         selectedSale.paymentMode === "Cash"
//                           ? "text-green-600"
//                           : "text-blue-600"
//                       }`}
//                     >
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

const SalesPage = () => {
  const [sales, setSales] = useState([]); // ✅ from API
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ✅ pagination + filters for API
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ✅ optional: payment filter
  const [paymentMode, setPaymentMode] = useState(""); // "UPI" | "CASH" | "CARD" etc

  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setApiError("");

      if (!token) {
        setApiError("Token not found. Please login again.");
        return;
      }

      // ✅ when date not selected use current month range (or you can change)
      const today = new Date();

      const startDate = new Date(today.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0]; // Jan 1 of current year
      const endDate = dateFilter || today.toISOString().split("T")[0]; // today or selected date

      const res = await axios.get("/order/get-all-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          pageSize,
          startDate,
          endDate,
          ...(paymentMode ? { paymentMode } : {}),
        },
      });

      const orders = res.data?.data || [];

      // ✅ Map backend order -> UI sale object
      const mapped = orders.map((o) => ({
        id: o._id,
        date: o.createdAt,
        time: formatTime(o.createdAt),
        invoiceNumber: o.invoiceNumber,
        totalAmount: o.grandTotal,
        paymentMode: o.paymentMode,

        // Invoice table uses: name, quantity, price
        items: (o.items || []).map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.sellingPrice,
        })),

        // if you want extra fields later
        subtotal: o.subtotal,
        taxAmount: o.taxAmount,
        taxRate: o.taxRate,
        status: o.status,
      }));

      setSales(mapped);
    } catch (err) {
      setApiError(
        err?.response?.data?.message || err?.message || "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load orders initially + when filters change
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, dateFilter, paymentMode]);

  const handlePreview = (sale) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  const handlePrint = (sale = selectedSale) => {
    const printContent = document.getElementById("invoice-print-content");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // ✅ Search filter only on frontend
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.paymentMode.toLowerCase().includes(searchTerm.toLowerCase());

      // dateFilter already applied in API, but keep safe check
      const matchesDate = !dateFilter || sale.date?.slice(0, 10) === dateFilter;

      return matchesSearch && matchesDate;
    });
  }, [sales, searchTerm, dateFilter]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Sales History
          </h1>
          <p className="text-text opacity-70">
            View and manage all transactions
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice # or payment mode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>

              <div className="relative sm:w-48">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>

              {/* ✅ optional filter */}
              <div className="sm:w-44">
                <select
                  value={paymentMode}
                  onChange={(e) => {
                    setPaymentMode(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">All Payments</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading sales...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Invoice #
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Total Amount
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Payment Mode
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-lg font-semibold">
                          <div className="font-medium">
                            {formatDate(sale.date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {sale.time}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-mono text-base font-medium text-secondary">
                            {sale.invoiceNumber}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-primary text-lg">
                            <MoneyValue amount={sale.totalAmount} size={12} />
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-medium bg-blue-100 text-blue-700">
                            {sale.paymentMode}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePreview(sale)}
                              className="flex items-center gap-1 px-3 py-2 text-secondary hover:bg-secondary hover:bg-opacity-10 rounded-lg transition-colors text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              Preview
                            </button>

                            <button
                              onClick={() => {
                                setSelectedSale(sale);
                                setTimeout(() => handlePrint(sale), 100);
                              }}
                              className="flex items-center gap-1 px-3 py-2 text-accent hover:bg-accent hover:bg-opacity-10 rounded-lg transition-colors text-sm font-medium"
                            >
                              <Printer className="w-4 h-4" />
                              Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredSales.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No sales records found
                </div>
              )}
            </>
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
                <h1 className="text-3xl font-bold text-primary mb-2">
                  Your Business Name
                </h1>
                <p className="text-text opacity-70">
                  123 Business Street, City, State 12345
                </p>
                <p className="text-text opacity-70">Phone: (123) 456-7890</p>
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
                          <MoneyValue amount={item.price} size={12} />
                        </td>
                        <td className="py-3 text-right font-medium text-text">
                          <MoneyValue
                            amount={item.quantity * item.price}
                            size={12}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-primary">
                      Total Amount:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      <MoneyValue amount={selectedSale.totalAmount} size={14} />
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Payment Mode:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {selectedSale.paymentMode}
                    </span>
                  </div>
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
