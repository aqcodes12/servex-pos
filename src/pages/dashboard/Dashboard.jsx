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
      value: <MoneyValue amount={stats.totalSales} size={20} />,
      icon: DollarSign,
      color: "bg-secondary",
      textColor: "text-secondary",
    },
    {
      title: "Total Orders Today",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-accent",
      textColor: "text-accent",
    },
    {
      title: "Total Items Sold Today",
      value: stats.itemsSold,
      icon: Package,
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      title: "Profit Today",
      value: <MoneyValue amount={stats.profit} size={20} />,
      icon: TrendingUp,
      color: "bg-green-500",
      textColor: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-text opacity-70">
            Track your daily performance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${card.color} bg-opacity-10 p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-text opacity-60 mb-1 font-medium">
                    {card.title}
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-primary">
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
