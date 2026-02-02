import React, { useEffect, useState } from "react";
import { Eye, Printer, Search, X, Calendar } from "lucide-react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";
import { showSuccessToast } from "../../utils/toastConfig";
import ActionButton from "../../components/ActionButton";
import Invoice from "../../components/Invoice";

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const posUser = JSON.parse(localStorage.getItem("pos_user"));
  const business = posUser?.restaurant || {};
  const role = posUser?.role;

  const token = localStorage.getItem("token");

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // rows per page
  const [totalPages, setTotalPages] = useState(1);

  const country = (business?.country || "").toUpperCase();
  const isIndia = country === "INDIA";

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
        params: {
          page,
          limit,
          search: searchTerm || undefined,
          paymentMode: paymentMode || undefined,
          status: statusFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });

      const { data, pagination } = res.data;

      setSales(
        (data || []).map((o) => {
          const statuses = [];
          statuses.push(o.status);

          if (o.status === "PAID" && o.cancelRequested) {
            statuses.push("CANCEL_REQUESTED");
          }

          return {
            id: o._id,
            invoiceNumber: o.invoiceNumber,
            date: o.createdAt,
            time: formatTime(o.createdAt),
            totalAmount: o.grandTotal,
            paymentMode: o.paymentMode,
            status: statuses,
            cancelInfo: o.cancelRequested
              ? {
                  name: o.createdBy?.name,
                  role: o.createdBy?.role,
                  at: o.cancelRequestedAt,
                }
              : null,
            items: o.items || [],

            // ✅ ADD THESE
            tax: o.tax,
            taxRate: o.taxRate,
            taxType: o.taxType,
            taxAmount: o.taxAmount,
            subtotal: o.subtotal,
            grandTotal: o.grandTotal,
          };
        }),
      );

      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      setApiError("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/category/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data?.data || []);
    } catch (err) {
      setApiError("Failed to load categories");
    }
  };

  const fetchOrdersByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setApiError("");

      const res = await axios.get(`/order/${categoryId}/getOrdersbyCategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = res.data;

      setSales(
        (data || []).map((o) => ({
          id: o._id,
          invoiceNumber: o.invoiceNumber,
          date: o.createdAt,
          time: formatTime(o.createdAt),
          totalAmount: o.grandTotal,
          paymentMode: o.paymentMode,
          status: [o.status],
          items: o.items || [],
          tax: o.tax,
          subtotal: o.subtotal,
          grandTotal: o.grandTotal,
        })),
      );

      setTotalPages(1); // since this API doesn’t return pagination
    } catch (err) {
      setApiError("Failed to load category orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   fetchOrders();
  // }, [page, searchTerm, paymentMode, statusFilter, startDate, endDate]);

  useEffect(() => {
    if (selectedCategory) {
      fetchOrdersByCategory(selectedCategory);
    } else {
      fetchOrders();
    }
  }, [
    page,
    searchTerm,
    paymentMode,
    statusFilter,
    startDate,
    endDate,
    selectedCategory,
  ]);

  const handleCancelSale = async (sale) => {
    try {
      if (!sale?.id) return;

      if (sale.status === "CANCELLED" || sale.status === "CANCEL_REQUESTED") {
        alert("Order already cancelled or cancellation requested");
        return;
      }

      const endpoint =
        role === "ADMIN"
          ? `/order/${sale.id}/cancel`
          : `/order/${sale.id}/request-cancel`;

      const res = await axios.post(
        endpoint,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200 && res.data.success) {
        const message = res.data.msg;
        showSuccessToast(message || "Order cancellation successful");
      }

      fetchOrders(); // refresh list
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to cancel order",
      );
    }
  };

  const handleRejectCancel = async (sale) => {
    try {
      const res = await axios.patch(`/order/${sale.id}/reject-cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 && res.data.success) {
        const message = res.data.msg;
        showSuccessToast(message || "Order cancellation rejected");
      }

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                   focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 
                   transition-all duration-200 outline-none text-sm"
              />
            </div>

            {/* Filters Group */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              {/* Payment Mode Filter */}
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                   focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 
                   transition-all duration-200 outline-none text-sm font-medium text-gray-700
                   cursor-pointer hover:bg-gray-100"
              >
                <option value="">All Payments</option>
                <option value={isIndia ? "UPI" : "MADA"}>
                  {isIndia ? "UPI" : "MADA"}
                </option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1); // reset pagination on change
                }}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
     focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 
     transition-all duration-200 outline-none text-sm font-medium text-gray-700
     cursor-pointer hover:bg-gray-100 min-w-[160px]"
              >
                <option value="">All Categories</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Date Range */}
              <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2 py-1 bg-transparent border-0 outline-none text-sm font-medium text-gray-700
                     cursor-pointer focus:ring-0"
                />

                <span className="text-gray-400 text-sm">→</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2 py-1 bg-transparent border-0 outline-none text-sm font-medium text-gray-700
                     cursor-pointer focus:ring-0"
                />

                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="ml-1 p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                    title="Clear dates"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl">
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
          ) : sales.length === 0 ? (
            <div className="p-12 text-center text-text/60">
              No sales recorded yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
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
                  {sales.map((s) => (
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
                        <StatusBadge
                          status={s.status}
                          cancelInfo={s.cancelInfo}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap whitespace-nowrap">
                          {/* View */}
                          <ActionButton
                            icon={Eye}
                            onClick={() => {
                              setSelectedOrderId(s.id);
                              setShowInvoice(true);
                            }}
                          >
                            View
                          </ActionButton>

                          {/* ADMIN – Approve / Reject */}
                          {role === "ADMIN" &&
                            s.status.includes("CANCEL_REQUESTED") && (
                              <>
                                <ActionButton
                                  variant="success"
                                  onClick={() => handleCancelSale(s)}
                                >
                                  ✓ Approve
                                </ActionButton>

                                <ActionButton
                                  variant="danger"
                                  onClick={() => handleRejectCancel(s)}
                                >
                                  ✕ Reject
                                </ActionButton>
                              </>
                            )}

                          {/* Normal cancel / request */}
                          {!s.status.includes("CANCEL_REQUESTED") &&
                            s.status[0] !== "CANCELLED" && (
                              <ActionButton
                                icon={X}
                                variant={
                                  role === "ADMIN" ? "danger" : "warning"
                                }
                                onClick={() => handleCancelSale(s)}
                              >
                                {role === "ADMIN" ? "Cancel" : "Request Cancel"}
                              </ActionButton>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
              <span className="text-sm text-text/60">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded-lg disabled:opacity-40"
                >
                  Prev
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showInvoice && selectedOrderId && (
        <Invoice
          open={showInvoice}
          orderId={selectedOrderId}
          onClose={() => {
            setShowInvoice(false);
            setSelectedOrderId(null);
          }}
        />
      )}
    </div>
  );
};

export default SalesPage;

const StatusBadge = ({ status, cancelInfo }) => {
  const styles = {
    PAID: "bg-secondary/10 text-secondary",
    CANCELLED: "bg-red-100 text-red-600",
    CANCEL_REQUESTED: "bg-yellow-100 text-yellow-700",
  };

  const labelMap = {
    PAID: "PAID",
    CANCELLED: "CANCELLED",
    CANCEL_REQUESTED: "CANCEL REQUESTED",
  };

  return (
    <div className="flex gap-2">
      {status.map((s) => {
        const isCancelRequested = s === "CANCEL_REQUESTED";

        return (
          <div key={s} className="relative group cursor-pointer">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold cursor-default whitespace-nowrap ${
                styles[s] || "bg-gray-100 text-gray-600"
              }`}
            >
              {labelMap[s]}
            </span>

            {/* Tooltip */}
            {isCancelRequested && cancelInfo && (
              <div className="absolute z-50 hidden group-hover:block left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-lg bg-black text-white text-xs p-3 shadow-lg">
                <div className="font-semibold mb-1">Cancel Requested</div>
                <div>
                  <span className="opacity-70">By:</span> {cancelInfo.name} (
                  {cancelInfo.role})
                </div>
                <div>
                  <span className="opacity-70">At:</span>{" "}
                  {new Date(cancelInfo.at).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
