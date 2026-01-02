import React from "react";
import StatCard from "./components/StatCard";
import { CircleDollarSign, Coffee, NotepadText, User } from "lucide-react";
import NewM from "./components/NewM";
import TodaysPerformance from "./components/TodaysPerformance";
import RevenueSales from "./components/RevenueSales";
import LiveOrders from "./components/LiveOrders";
import TopSelling from "./components/TopSelling";
import RecentOrders from "./components/RecentOrders";

const HomePage = () => {
  const stats = [
    {
      id: 1,
      title: "Total Revenue",
      value: " SAR 72,400",
      icon: CircleDollarSign,
      percentage: 20,
      period: "This month",
      change: "Positive",
    },
    {
      id: 2,
      title: "Total Menu",
      value: "56",
      icon: Coffee,
      percentage: "+10",
      period: "Menu this month",
      change: "Positive",
    },
    {
      id: 3,
      title: "Total Orders",
      value: "1,245",
      icon: NotepadText,
      percentage: "25,9%",
      period: "This month",
      change: "Positive",
    },
    {
      id: 4,
      title: "Total Customers",
      value: "860",
      icon: User,
      percentage: "5,6%",
      period: "This month",
      change: "Negative",
    },
  ];

  return (
    <>
      {/* Responsive parent container */}
      <div className="flex flex-col lg:flex-row items-start gap-6 p-4">
        {/* Left section – 70% width on large screens, full width on small */}
        <div className="w-full lg:w-[70%] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 place-items-center">
            {stats.map((item) => (
              <StatCard
                key={item.id}
                title={item.title}
                value={item.value}
                icon={item.icon}
                percentage={item.percentage}
                period={item.period}
                change={item.change}
              />
            ))}
          </div>
          <RevenueSales />
          <RecentOrders />
        </div>

        {/* Right section – 30% width on large screens, full width on small */}
        <div className="w-full lg:w-[30%] space-y-4 grid place-items-center">
          <NewM />
          <TodaysPerformance />
          <LiveOrders />
          <TopSelling />
        </div>
      </div>
    </>
  );
};

export default HomePage;
