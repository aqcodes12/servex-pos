import React from "react";

const TopSelling = () => {
  const totalOrders = 1099;
  const topItem = {
    name: "Coffee Day Hot",
    sold: 756,
    percentage: 80.8,
  };

  return (
    <div className="p-5 bg-white border border-gray-100 rounded-2xl  w-full max-w-sm">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Top Selling Items
      </h2>

      {/* Menu Sold Section */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm">Menu Sold</p>
        <p className="text-2xl font-semibold text-gray-800">
          {totalOrders.toLocaleString()}
          <span className="text-gray-500 text-sm font-normal ml-1">
            Orders created
          </span>
        </p>
      </div>

      <hr className="border-gray-100 my-2" />

      {/* Top Item */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-gray-800 font-medium">{topItem.name}</p>
          <p className="text-gray-600 text-sm">
            {topItem.sold}{" "}
            <span className="text-gray-500">({topItem.percentage}%)</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${topItem.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TopSelling;
