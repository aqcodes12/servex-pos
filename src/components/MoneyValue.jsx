import CurrencyIcon from "./CurrencyIcon";

const MoneyValue = ({
  amount = 0,
  size = 14,
  iconClassName = "",
  textClassName = "",
}) => {
  const safeAmount = Number(amount ?? 0);

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <CurrencyIcon size={size} className={iconClassName} />
      <span
        className={`
          font-bold
          leading-none
          ${textClassName}
        `}
        style={{ fontSize: size }}
      >
        {safeAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </span>
  );
};

export default MoneyValue;
