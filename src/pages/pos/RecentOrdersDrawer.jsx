// import { X, Printer, RotateCcw, XCircle } from "lucide-react";
// import MoneyValue from "../../components/MoneyValue";

// const RecentOrdersDrawer = ({
//   open,
//   onClose,
//   orders = [],
//   role,
//   onCancel,
//   onReprint,
// }) => {
//   if (!open) return null;

//   const isCancelled =
//     o.status === "CANCELLED" || o.status === "CANCEL_REQUESTED";

//   return (
//     <div className="fixed inset-0 z-50 flex">
//       {/* Backdrop */}
//       <div className="flex-1 bg-black/30" onClick={onClose} />

//       {/* Drawer */}
//       <div className="w-[380px] bg-white shadow-xl flex flex-col">
//         {/* Header */}
//         <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
//           <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
//           <button onClick={onClose}>
//             <X />
//           </button>
//         </div>

//         {/* Orders */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//           {orders.length === 0 && (
//             <p className="text-slate-400 text-center">No recent orders</p>
//           )}

//           {orders.map((o) => (
//             <div
//               key={o._id}
//               className="border border-slate-200 rounded-xl p-3 space-y-2"
//             >
//               <div className="flex justify-between">
//                 <span className="font-semibold text-slate-700">
//                   {o.invoiceNumber}
//                 </span>
//                 <span
//                   className={`text-xs font-bold px-2 py-1 rounded-full
//                     ${
//                       o.status === "PAID"
//                         ? "bg-green-50 text-green-700"
//                         : "bg-yellow-50 text-yellow-700"
//                     }`}
//                 >
//                   {o.status}
//                 </span>
//               </div>

//               <div className="text-sm text-slate-600">
//                 <MoneyValue amount={o.amount} size={14} /> · {o.paymentMode}
//               </div>

//               <div className="text-xs text-slate-400">
//                 {new Date(o.createdAt).toLocaleTimeString()}
//               </div>

//               {/* Actions */}
//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => onReprint(o)}
//                   className="flex items-center gap-1 px-2 py-1
//                     border border-slate-300 rounded-md
//                     text-sm hover:bg-slate-100"
//                 >
//                   <Printer size={14} />
//                   Reprint
//                 </button>

//                 {role === "CASHIER" && (
//                   <button
//                     onClick={() => onCancel(o)}
//                     className="flex items-center gap-1 px-2 py-1
//                       border border-yellow-300 text-yellow-700
//                       rounded-md hover:bg-yellow-50 text-sm"
//                   >
//                     <RotateCcw size={14} />
//                     Request Cancel
//                   </button>
//                 )}

//                 {role === "ADMIN" && (
//                   <button
//                     onClick={() => onCancel(o)}
//                     className="flex items-center gap-1 px-2 py-1
//                       border border-red-300 text-red-700
//                       rounded-md hover:bg-red-50 text-sm"
//                   >
//                     <XCircle size={14} />
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentOrdersDrawer;

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

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[380px] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <button onClick={onClose}>
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
                {/* Top */}
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">
                    {o.invoiceNumber}
                  </span>

                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      o.status === "PAID"
                        ? "bg-green-50 text-green-700"
                        : o.status === "CANCELLED"
                          ? "bg-red-50 text-red-700"
                          : o.status === "CANCEL_REQUESTED"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-sm text-slate-600">
                  <MoneyValue amount={o.amount} size={14} /> · {o.paymentMode}
                </div>

                {/* Time */}
                <div className="text-xs text-slate-400">
                  {new Date(o.createdAt).toLocaleTimeString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {/* Reprint */}
                  <button
                    onClick={() => onReprint(o)}
                    className="flex items-center gap-1 px-2 py-1
                      border border-slate-300 rounded-md
                      text-sm hover:bg-slate-100"
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
                        rounded-md hover:bg-yellow-50 text-sm"
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
                        rounded-md hover:bg-red-50 text-sm"
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
