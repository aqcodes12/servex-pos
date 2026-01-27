import React, { useEffect, useState } from "react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";

const RecentTable = () => {
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      setApiError("");

      const res = await axios.get("/order/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data?.data || []);
    } catch {
      setApiError("Failed to load recent orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const getStatus = (o) => {
    if (o.status === "CANCELLED") {
      return {
        text: "Cancelled",
        className: "bg-red-100 text-red-700",
      };
    }

    if (o.status === "PAID" && o.cancelRequested) {
      return {
        text: "Cancel Requested",
        className: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: "Paid",
      className: "bg-green-100 text-green-700",
    };
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-sm text-text/70 mt-1">
          Latest transactions from POS
        </p>
      </div>

      {/* Error */}
      {apiError && (
        <div className="m-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg">
          {apiError}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 flex items-center gap-4 animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty */
        <div className="p-8 text-center text-text/70">No recent orders yet</div>
      ) : (
        /* Table */
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background border-b border-gray-100">
              <tr className="text-left text-text/70">
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Payment</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => {
                const status = getStatus(o);

                return (
                  <tr key={o._id} className="hover:bg-background transition">
                    <td className="px-6 py-4 font-mono text-primary">
                      {o.invoiceNumber}
                    </td>

                    <td className="px-6 py-4 font-semibold text-primary">
                      <MoneyValue amount={o.amount} size={12} />
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                        {o.paymentMode}
                      </span>
                    </td>

                    <td className="px-6 py-4">{o.itemCount}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-text/70">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTable;
