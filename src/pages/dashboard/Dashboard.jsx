import React, { useState } from "react";
import { TrendingUp, ShoppingCart, Package, DollarSign } from "lucide-react";
import MoneyValue from "../../components/MoneyValue";

const Dashboard = () => {
  const [stats] = useState({
    totalSales: 12847.5,
    totalOrders: 156,
    itemsSold: 342,
    profit: 4523.8,
  });

  const cards = [
    {
      title: "Total Sales Today",
      value: <MoneyValue amount={stats.totalSales} size={26} />,
      icon: DollarSign,
      bg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Total Orders Today",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Items Sold Today",
      value: stats.itemsSold,
      icon: Package,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Profit Today",
      value: <MoneyValue amount={stats.profit} size={26} />,
      icon: TrendingUp,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="h-[85vh] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Analytics Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Today’s performance overview</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="
                bg-white
                rounded-2xl
                border border-slate-200
                p-6
                flex flex-col gap-4
              "
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
    </div>
  );
};

export default Dashboard;
