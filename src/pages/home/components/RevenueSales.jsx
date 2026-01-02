import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Calendar } from "lucide-react";

const data = [
  { month: "Jan", revenue: 120, sale: 140 },
  { month: "Feb", revenue: 150, sale: 160 },
  { month: "Mar", revenue: 180, sale: 200 },
  { month: "Apr", revenue: 300, sale: 190 },
  { month: "May", revenue: 270, sale: 210 },
  { month: "Jun", revenue: 330, sale: 190 },
  { month: "Jul", revenue: 290, sale: 160 },
  { month: "Aug", revenue: 260, sale: 150 },
  { month: "Sep", revenue: 310, sale: 170 },
  { month: "Oct", revenue: 240, sale: 140 },
  { month: "Nov", revenue: 330, sale: 180 },
  { month: "Dec", revenue: 300, sale: 200 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const isRevenue = item.dataKey === "revenue";
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-md">
        <p className="font-medium">{`${label}, 2025`}</p>
        <p
          className={`flex items-center gap-2 ${
            isRevenue ? "text-primary" : "text-yellow-400"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRevenue ? "bg-primary" : "bg-yellow-400"
            }`}
          ></span>
          ${item.value.toFixed(3)} {isRevenue ? "Revenue" : "Sale"}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueSales = () => {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg font-semibold text-gray-800">
          Revenues VS Sales
        </h2>
        <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
          <Calendar size={16} />
          Monthly
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#A7F3D0", strokeWidth: 1 }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ top: -20, right: 0, fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="sale"
              stroke="#FACC15"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueSales;
