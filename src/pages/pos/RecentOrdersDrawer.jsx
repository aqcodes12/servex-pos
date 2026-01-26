import { X, Printer, RotateCcw, XCircle } from "lucide-react";
import MoneyValue from "../../components/MoneyValue";

const RecentOrdersDrawer = ({
  open,
  onClose,
  orders = [],
  role,
  onCancel,
  onReprint,
}) => {
  if (!open) return null;

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    // fallback for old orders
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[380px] bg-white shadow-xl flex flex-col">
        {/* Header (sticky) */}
        <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-100"
          >
            <X />
          </button>
        </div>

        {/* Orders */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orders.length === 0 && (
            <p className="text-slate-400 text-center">No recent orders</p>
          )}

          {orders.map((o) => {
            const isCancelled =
              o.status === "CANCELLED" || o.status === "CANCEL_REQUESTED";

            return (
              <div
                key={o._id}
                className="border border-slate-200 rounded-xl p-3 space-y-2"
              >
                {/* Invoice + Status */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="font-semibold text-slate-700 truncate">
                    {o.invoiceNumber}
                  </span>

                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap
                      ${
                        o.status === "PAID"
                          ? "bg-green-50 text-green-700"
                          : o.status === "CANCELLED"
                            ? "bg-red-50 text-red-700"
                            : o.status === "CANCEL_REQUESTED"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-yellow-50 text-yellow-700"
                      }
                    `}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Amount + payment */}
                <div className="text-sm text-slate-600">
                  <MoneyValue amount={o.amount} size={14} /> ·{" "}
                  <span className="font-medium">{o.paymentMode}</span>
                </div>

                {/* Time */}
                <div className="text-xs text-slate-400">
                  {timeAgo(o.createdAt)}
                </div>

                {/* Actions (never wrap) */}
                <div className="flex items-center gap-2 pt-2 flex-nowrap overflow-x-auto">
                  {/* Reprint */}
                  <button
                    onClick={() => onReprint(o)}
                    className="flex items-center gap-1 px-2 py-1
                      border border-slate-300 rounded-md
                      text-sm hover:bg-slate-100
                      whitespace-nowrap"
                  >
                    <Printer size={14} />
                    Reprint
                  </button>

                  {/* CASHIER */}
                  {role === "CASHIER" && !isCancelled && (
                    <button
                      onClick={() => onCancel(o)}
                      className="flex items-center gap-1 px-2 py-1
                        border border-yellow-300 text-yellow-700
                        rounded-md hover:bg-yellow-50
                        text-sm whitespace-nowrap"
                    >
                      <RotateCcw size={14} />
                      Request Cancel
                    </button>
                  )}

                  {/* ADMIN */}
                  {role === "ADMIN" && !isCancelled && (
                    <button
                      onClick={() => onCancel(o)}
                      className="flex items-center gap-1 px-2 py-1
                        border border-red-300 text-red-700
                        rounded-md hover:bg-red-50
                        text-sm whitespace-nowrap"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersDrawer;
