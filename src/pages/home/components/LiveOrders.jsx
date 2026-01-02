import React from "react";

const LiveOrders = () => {
  const orders = [
    {
      id: 1,
      name: "Mohammed",
      product: "Coffe day Hot",
      quantity: 1,
      time: "Today at 12:30",
    },
    {
      id: 2,
      name: "Akbar",
      product: "Ice coffe day",
      quantity: 3,
      time: "Today at 08:20",
    },
    {
      id: 3,
      name: "Zain",
      product: "Magic Bar",
      quantity: 2,
      time: "Yesterday at 18:30",
    },
  ];

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Live Orders</h2>
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        {/* Header */}

        {/* Orders List */}
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-start justify-between py-3 hover:bg-gray-50 rounded-xl px-2 transition"
            >
              <div>
                <p className="text-gray-800 text-sm font-medium">
                  {order.name}{" "}
                  <span className="text-gray-600 font-normal">
                    purchased {order.quantity}× {order.product}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{order.time}</p>
              </div>
              <button className="text-primary text-sm font-medium hover:underline">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveOrders;
