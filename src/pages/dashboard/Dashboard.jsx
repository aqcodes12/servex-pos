import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, ShoppingCart, Package, DollarSign } from "lucide-react";
import MoneyValue from "../../components/MoneyValue";
import RecentTable from "./RecentTable";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    itemsSold: 0,
    profit: 0,
  });
  const [paymentModeSales, setPaymentModeSales] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const fetchTodayDashboard = async () => {
    try {
      setLoading(true);
      setApiError("");

      const token = localStorage.getItem("token");
      if (!token) return setApiError("Token not found");

      const res = await axios.get("/order/dashboard/today", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = res.data?.data;
      setStats({
        totalSales: d?.totalSales ?? 0,
        totalOrders: d?.totalOrders ?? 0,
        itemsSold: d?.totalItemsSold ?? 0,
        profit: d?.totalProfit ?? 0,
      });
    } catch {
      setApiError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentModeSales = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/order/payment-mode-sales", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPaymentModeSales(res.data?.data || {});
    } catch {
      setApiError("Failed to load payment mode sales");
    }
  };

  useEffect(() => {
    fetchTodayDashboard();
    fetchPaymentModeSales();
  }, []);

  const statCards = [
    {
      label: "Total Sales",
      value: <MoneyValue amount={stats.totalSales} size={22} />,
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      label: "Items Sold",
      value: stats.itemsSold,
      icon: Package,
    },
    {
      label: "Profit",
      value: <MoneyValue amount={stats.profit} size={22} />,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-text/70 mt-1">Today’s performance overview</p>
          </div>

          <button
            onClick={() => {
              fetchTodayDashboard();
              fetchPaymentModeSales();
            }}
            className="px-4 py-2 rounded-lg border border-gray-200
              text-sm font-medium text-text hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {apiError && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-xl p-6 animate-pulse space-y-4"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                </div>
              ))
            : statCards.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 rounded-xl p-6 space-y-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-text/70">{c.label}</p>
                      <div className="text-2xl font-bold text-primary">
                        {c.value}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Payment Modes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">
            Payment Mode Sales
          </h2>

          {Object.keys(paymentModeSales).length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center text-text/70">
              No payment data yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(paymentModeSales).map(([mode, amount]) => (
                <div
                  key={mode}
                  className="bg-white border border-gray-100 rounded-xl p-6 space-y-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">{mode}</p>
                    <div className="text-xl font-bold text-primary">
                      <MoneyValue amount={amount} size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Recent Orders</h2>
          <RecentTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
