import React from "react";

const MobileComingSoonModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[90%] max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">
          Mobile App Coming Soon 🚀
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          This Application is optimized for desktop. Our mobile app is on the
          way!
        </p>

        <button
          disabled
          className="mt-6 w-full rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-600 cursor-not-allowed"
        >
          Stay Tuned
        </button>
      </div>
    </div>
  );
};

export default MobileComingSoonModal;
