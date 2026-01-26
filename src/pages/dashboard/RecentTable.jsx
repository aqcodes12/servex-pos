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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data?.data || []);
    } catch (err) {
      setApiError("Failed to load recent orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const getStatusBadge = (order) => {
    if (order.status === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    if (order.status === "PAID" && order.cancelRequested) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getStatusText = (order) => {
    if (order.status === "CANCELLED") return "CANCELLED";
    if (order.status === "PAID" && order.cancelRequested)
      return "CANCEL REQUESTED";
    return "PAID";
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
      </div>

      {apiError && (
        <div className="m-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg">
          {apiError}
        </div>
      )}

      {loading ? (
        <div className="p-6 text-center text-slate-500">
          Loading recent orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-6 text-center text-slate-400">
          No recent orders found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm">
                    {o.invoiceNumber}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    <MoneyValue amount={o.amount} size={12} />
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {o.paymentMode}
                    </span>
                  </td>

                  <td className="px-6 py-4">{o.itemCount}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                        o,
                      )}`}
                    >
                      {getStatusText(o)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentTable;
