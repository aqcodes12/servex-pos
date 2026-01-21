import { Trash2 } from "lucide-react";
import React from "react";
import MoneyValue from "../../components/MoneyValue";

const CartItem = ({ item, changeQty, removeItem }) => {
  return (
    <>
      <div key={item.name} className="flex justify-between items-center">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-slate-500">
            <MoneyValue amount={item.sellingPrice} size={12} /> × {item.qty}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => changeQty(item.name, -1)}
            className="px-2 bg-slate-200 rounded"
          >
            −
          </button>

          <span className="min-w-[20px] text-center">{item.qty}</span>

          <button
            onClick={() => changeQty(item.name, 1)}
            className="px-2 bg-slate-200 rounded"
          >
            +
          </button>

          {/* Delete */}
          <button
            onClick={() => removeItem(item.name)}
            className="ml-2 text-red-500 hover:text-red-600"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default CartItem;

// import React from "react";
// import { Trash2 } from "lucide-react";
// import MoneyValue from "../../components/MoneyValue";

// const CartItem = ({ item, changeQty, removeItem }) => {
//   return (
//     <div className="py-4 border-b border-slate-200">
//       {/* Item Name */}
//       <p className="text-lg font-semibold text-slate-800 leading-snug">
//         {item.name}
//       </p>

//       {/* Price */}
//       <p className="text-base text-slate-500 mt-1 flex justify-start items-center gap-1">
//         <MoneyValue amount={item.price} size={16} /> × {item.qty}
//       </p>

//       {/* Actions */}
//       <div className="flex items-center justify-between mt-3">
//         {/* Quantity Controls */}
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => changeQty(item.name, -1)}
//             className="h-10 w-10 flex items-center justify-center
//                        rounded-lg bg-slate-200 text-xl font-semibold
//                        active:scale-95"
//           >
//             −
//           </button>

//           <span className="min-w-[32px] text-center text-lg font-semibold">
//             {item.qty}
//           </span>

//           <button
//             onClick={() => changeQty(item.name, 1)}
//             className="h-10 w-10 flex items-center justify-center
//                        rounded-lg bg-teal-500 text-white text-xl font-semibold
//                        active:scale-95"
//           >
//             +
//           </button>
//         </div>

//         {/* Remove */}
//         <button
//           onClick={() => removeItem(item.name)}
//           className="h-10 w-10 flex items-center justify-center
//                      rounded-lg bg-red-100 text-red-600
//                      hover:bg-red-200 active:scale-95"
//           title="Remove item"
//         >
//           <Trash2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartItem;
