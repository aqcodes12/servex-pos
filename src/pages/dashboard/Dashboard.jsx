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
  const [paymentModeSales, setPaymentModeSales] = useState([]);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const fetchTodayDashboard = async () => {
    try {
      setLoading(true);
      setApiError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Token not found. Please login again.");
        return;
      }

      const res = await axios.get("/order/dashboard/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data;

      setStats({
        totalSales: data?.totalSales ?? 0,
        totalOrders: data?.totalOrders ?? 0,
        itemsSold: data?.totalItemsSold ?? 0,
        profit: data?.totalProfit ?? 0,
      });
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentModeSales = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setApiError("Token not found. Please login again.");
        return;
      }

      const res = await axios.get("/order/payment-mode-sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPaymentModeSales(res.data?.data || {});
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load payment mode sales",
      );
    }
  };

  useEffect(() => {
    fetchTodayDashboard();
    fetchPaymentModeSales();
  }, []);

  const cards = [
    {
      title: "Total Sales",
      value: <MoneyValue amount={stats.totalSales} size={26} />,
      icon: DollarSign,
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Items Sold",
      value: stats.itemsSold,
      icon: Package,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Profit",
      value: <MoneyValue amount={stats.profit} size={26} />,
      icon: TrendingUp,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  const paymentCards = Object.entries(paymentModeSales).map(
    ([mode, amount]) => ({
      title: mode,
      value: <MoneyValue amount={amount} size={22} />,
      icon: DollarSign,
      bg:
        mode === "CASH"
          ? "bg-green-50"
          : mode === "UPI"
            ? "bg-indigo-50"
            : "bg-slate-50",
      iconColor:
        mode === "CASH"
          ? "text-green-600"
          : mode === "UPI"
            ? "text-indigo-600"
            : "text-slate-600",
    }),
  );

  return (
    <div className="h-[85vh] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Today’s performance overview</p>
        </div>

        <button
          onClick={() => {
            fetchTodayDashboard();
            fetchPaymentModeSales();
          }}
          className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {apiError && (
        <div className="mb-4 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl">
          {apiError}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center text-slate-500 py-12 text-lg">
          Loading dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>

                {/* Content */}
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">
                    {card.title}
                  </p>
                  <div className="text-3xl font-bold text-slate-800">
                    {card.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {Object.keys(paymentModeSales).length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Payment Mode Sales
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4"
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-xl ${card.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">
                      {card.title}
                    </p>
                    <div className="text-2xl font-bold text-slate-800">
                      {card.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-5">
        <RecentTable />
      </div>
    </div>
  );
};

export default Dashboard;
