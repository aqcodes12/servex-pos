import CurrencyIcon from "./CurrencyIcon";

const MoneyValue = ({
  amount,
  size = 14,
  iconClassName = "",
  textClassName = "",
}) => {
  return (
    <span className={`inline-flex items-center gap-1`}>
      <CurrencyIcon size={size} className={iconClassName} />
      <span className={`${textClassName}`}>
        {amount.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </span>
  );
};

export default MoneyValue;
