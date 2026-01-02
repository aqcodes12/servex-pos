import { MoveUpRight, MoveDownLeft } from "lucide-react";
import React from "react";

const StatCard = ({ title, value, icon: Icon, percentage, period, change }) => {
  const isPositive = change === "Positive";
  const TrendIcon = isPositive ? MoveUpRight : MoveDownLeft;

  return (
    <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 max-w-[220px] min-w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-emerald-50 text-primary p-2 rounded-xl">
          <Icon size={20} />
        </span>
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>

      {/* Value */}
      <p className="text-3xl font-semibold text-gray-900 mb-3">{value}</p>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium
            ${
              isPositive
                ? "bg-emerald-50 text-primary"
                : "bg-red-50 text-red-600"
            }`}
        >
          <TrendIcon size={14} /> {percentage}
        </span>
        <p className="text-sm text-gray-500">{period}</p>
      </div>
    </div>
  );
};

export default StatCard;
