import CurrencyIcon from "./CurrencyIcon";

const MoneyValue = ({
  amount = 0,
  size = 14,
  iconClassName = "",
  textClassName = "",
}) => {
  const safeAmount = Number(amount ?? 0);

  return (
    <span className="inline-flex items-center gap-1">
      <CurrencyIcon size={size} className={iconClassName} />
      <span className={`${textClassName} font-bold text-xl`}>
        {safeAmount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </span>
  );
};

export default MoneyValue;
