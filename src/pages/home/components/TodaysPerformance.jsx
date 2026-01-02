import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const TodaysPerformance = () => {
  // tweak these to change arc fill (0–100 over the half circle)
  const revenuePct = 85; // green arc percent of the half circle
  const salesPct = 60; // yellow arc percent of the half circle

  return (
    <div className="p-5 bg-white rounded-2xl  border border-gray-100 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Today Performance
        </h2>
        <button className="text-sm text-primary font-medium">Detail</button>
      </div>

      {/* Semi-circle gauge */}
      <div className="relative flex justify-center">
        <svg
          viewBox="0 0 200 120"
          className="w-full max-w-[280px] overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ----- OUTER RING (track + progress) ----- */}
          {/* Track */}
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            pathLength="100"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            pathLength="100"
            fill="none"
            stroke="#10B981"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${revenuePct} 100`}
          />

          {/* ----- INNER RING (track + progress) ----- */}
          {/* Track */}
          <path
            d="M35 100 A65 65 0 0 1 165 100"
            pathLength="100"
            fill="none"
            stroke="#F5F6F8"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d="M35 100 A65 65 0 0 1 165 100"
            pathLength="100"
            fill="none"
            stroke="#FACC15"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${salesPct} 100`}
          />

          {/* Center text (aligned to gauge center) */}
          <text
            x="100"
            y="72"
            textAnchor="middle"
            className="fill-gray-800"
            fontSize="15"
            fontWeight="600"
          >
            SAR 360
          </text>
          <text
            x="100"
            y="90"
            textAnchor="middle"
            className="fill-gray-500"
            fontSize="12"
          >
            Today Revenue
          </text>
        </svg>
      </div>

      {/* Legend / stats */}
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-gray-700 font-medium">Revenue</span>
          </div>
          <span className="flex items-center gap-1 text-primary font-medium">
            <ArrowUpRight size={14} /> 22.9%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-gray-700 font-medium">Sale</span>
          </div>
          <span className="flex items-center gap-1 text-red-500 font-medium">
            <ArrowDownRight size={14} /> 20%
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-700 font-medium">Yesterday</span>
          </div>
          <span className="text-gray-800 font-semibold">SAR 560.8</span>
        </div>
      </div>
    </div>
  );
};

export default TodaysPerformance;
