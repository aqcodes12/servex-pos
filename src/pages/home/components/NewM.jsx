import { Coffee, Plus } from "lucide-react";
import React from "react";

const NewM = () => {
  return (
    <div className="flex justify-between items-center gap-5 border py-2 px-4 border-gray-200 rounded-2xl w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="bg-emerald-50 text-primary p-2 rounded-xl">
          <Coffee size={20} />
        </span>
        <h3 className="text-sm font-semibold text-gray-700">New Menu</h3>
      </div>

      {/* Action Button */}
      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary active:scale-95 transition-all duration-150">
        <Plus size={18} />
        Add
      </button>
    </div>
  );
};

export default NewM;
