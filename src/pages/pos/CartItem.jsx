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
            <MoneyValue amount={item.sellingPrice} size={14} /> × {item.qty}
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
