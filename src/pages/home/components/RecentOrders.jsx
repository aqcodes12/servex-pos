import React from "react";
import { MoreHorizontal } from "lucide-react";

const RecentOrders = () => {
  const orders = [
    {
      id: 1,
      productName: "Ice coffee day",
      type: "Iced",
      orderId: "#4UT014Y0UT",
      date: "08 Jun, 10:30",
      customer: "Mohammed",
      customerType: "Star Customer",
      price: 5.0,
      payment: "Cash on Delivery",
      status: "Waiting...",
      statusColor: "text-gray-500",
    },
    {
      id: 2,
      productName: "Brownies",
      type: "Hot",
      orderId: "#D3519N1491",
      date: "08 Jun, 09:50",
      customer: "Azrul Artistik",
      customerType: "Star Customer",
      price: 8.2,
      payment: "Paid by apple pay",
      status: "Packaged",
      statusColor: "text-amber-500",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        <button className="text-primary text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Table Wrapper for Responsiveness */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-600 text-sm">
              <th className="py-2 px-3">Product Name</th>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition"
              >
                {/* Product */}
                <td className="py-3 px-3">
                  <div>
                    <p className="font-medium text-gray-800">
                      {order.productName}
                    </p>
                    <p className="text-gray-500 text-xs">{order.type}</p>
                  </div>
                </td>

                {/* Order ID */}
                <td className="py-3 px-3">
                  <p className="font-medium text-gray-800">{order.orderId}</p>
                  <p className="text-gray-500 text-xs">{order.date}</p>
                </td>

                {/* Customer */}
                <td className="py-3 px-3">
                  <p className="font-medium text-gray-800">{order.customer}</p>
                  <p className="text-gray-500 text-xs">{order.customerType}</p>
                </td>

                {/* Price */}
                <td className="py-3 px-3">
                  <p className="font-medium text-gray-800">
                    {order.price.toFixed(2)}{" "}
                    <span className="text-xs">SAR</span>
                  </p>
                  <p className="text-gray-500 text-xs">{order.payment}</p>
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  <span
                    className={`flex items-center gap-2 font-medium ${order.statusColor}`}
                  >
                    {order.statusColor === "text-amber-500" && (
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                    )}
                    {order.status}
                  </span>
                </td>

                {/* Action */}
                <td className="py-3 px-3 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
