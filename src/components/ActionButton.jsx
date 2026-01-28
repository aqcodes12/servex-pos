import React from "react";
import clsx from "clsx";

const VARIANTS = {
  primary: {
    base: "border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/20",
  },
  success: {
    base: "border-green-300 bg-green-50 text-green-700 hover:bg-green-100",
  },
  danger: {
    base: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
  },
  warning: {
    base: "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  },
};

const ActionButton = ({
  children,
  icon: Icon,
  variant = "primary",
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition",
        "active:scale-[0.98]",
        disabled && "opacity-50 cursor-not-allowed",
        VARIANTS[variant]?.base,
        className,
      )}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
};

export default ActionButton;
