import React, { useEffect, useMemo, useState } from "react";
import { Eye, Printer, Search, X, Calendar } from "lucide-react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";
import { showSuccessToast } from "../../utils/toastConfig";

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

  const [page, setPage] = useState(1);
  const [limit] = useState(10); // rows per page
  const [totalPages, setTotalPages] = useState(1);

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
        },
      });

      const { data, pagination } = res.data;

      setSales(
        (data || []).map((o) => {
          const statuses = [];

          // Always show main status
          statuses.push(o.status);

          // If cancel requested & still paid → show both
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

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm, paymentMode, statusFilter]);

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

  /* ---------------- Filters ---------------- */

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
          ) : sales.length === 0 ? (
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

                    {/* <td className="px-6 py-4 space-x-2">
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

                      {s.status !== "CANCELLED" &&
                        (role === "ADMIN" ||
                          s.status !== "CANCEL_REQUESTED") && (
                          <button
                            onClick={() => handleCancelSale(s)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
          ${
            role === "ADMIN"
              ? "text-red-600 hover:bg-red-50"
              : "text-yellow-600 hover:bg-yellow-50"
          }`}
                          >
                            <X size={14} />
                            {role === "ADMIN" ? "Cancel" : "Request Cancel"}
                          </button>
                        )}
                    </td> */}
                    <td className="px-6 py-4 space-x-2">
                      {/* View */}
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

                      {/* ADMIN – Approve / Reject */}
                      {role === "ADMIN" &&
                        s.status.includes("CANCEL_REQUESTED") && (
                          <>
                            <button
                              onClick={() => handleCancelSale(s)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50"
                            >
                              ✓ Approve
                            </button>

                            <button
                              onClick={() => handleRejectCancel(s)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}

                      {/* Normal cancel / request */}
                      {!s.status.includes("CANCEL_REQUESTED") &&
                        s.status[0] !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancelSale(s)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
          ${
            role === "ADMIN"
              ? "text-red-600 hover:bg-red-50"
              : "text-yellow-600 hover:bg-yellow-50"
          }`}
                          >
                            <X size={14} />
                            {role === "ADMIN" ? "Cancel" : "Request Cancel"}
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold cursor-default ${
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
