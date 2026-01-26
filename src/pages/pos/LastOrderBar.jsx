import { Printer, XCircle, RotateCcw } from "lucide-react";
import MoneyValue from "../../components/MoneyValue";

const LastOrderBar = ({ order, role, onCancel, onReprint }) => {
  if (!order) return null;

  const isCancelled =
    order.status === "CANCELLED" || order.status === "CANCEL_REQUESTED";

  const statusStyles = {
    PAID: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    CANCEL_REQUESTED: "bg-orange-50 text-orange-700 border-orange-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      <div
        className="
          px-4 py-3
          flex items-center gap-4
          flex-nowrap min-w-0
        "
      >
        {/* LEFT INFO (never wraps) */}
        <div className="flex items-center gap-4 text-sm flex-nowrap min-w-0">
          {/* Invoice */}
          <div className="font-semibold text-slate-700 whitespace-nowrap">
            Invoice:
            <span className="ml-2 text-teal-600 font-bold">
              {order.invoiceNo}
            </span>
          </div>

          {/* Total */}
          <div className="font-semibold text-slate-700 whitespace-nowrap">
            Total:
            <span className="ml-2 font-bold text-slate-900">
              <MoneyValue amount={order.totalAmount} size={16} />
            </span>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap
              ${
                statusStyles[order.status] ||
                "bg-gray-50 text-gray-700 border-gray-200"
              }
            `}
          >
            {order.status}
          </span>
        </div>

        {/* RIGHT ACTIONS (scroll-safe, single line) */}
        <div className="flex items-center gap-2 ml-auto flex-nowrap overflow-x-auto scrollbar-hide">
          {/* CASHIER */}
          {role === "CASHIER" && !isCancelled && (
            <>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-3 py-2
                border border-yellow-300 text-yellow-700
                rounded-lg hover:bg-yellow-50 transition
                whitespace-nowrap"
              >
                <RotateCcw size={16} />
                Request Cancel
              </button>

              <button
                onClick={onReprint}
                className="flex items-center gap-2 px-3 py-2
                border border-slate-300 text-slate-700
                rounded-lg hover:bg-slate-100 transition
                whitespace-nowrap"
              >
                <Printer size={16} />
                Reprint
              </button>
            </>
          )}

          {/* ADMIN */}
          {role === "ADMIN" && !isCancelled && (
            <>
              <button
                onClick={onReprint}
                className="flex items-center gap-2 px-3 py-2
                border border-slate-300 text-slate-700
                rounded-lg hover:bg-slate-100 transition
                whitespace-nowrap"
              >
                <Printer size={16} />
                Reprint
              </button>

              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-3 py-2
                border border-red-300 text-red-700
                rounded-lg hover:bg-red-50 transition
                whitespace-nowrap"
              >
                <XCircle size={16} />
                Cancel Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LastOrderBar;
