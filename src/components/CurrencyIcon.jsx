import riyal from "../assets/riyal.png";

const CurrencyIcon = ({ size = 14, isWhite = false, className = "" }) => {
  return (
    <img
      src={riyal}
      alt="SAR"
      className={`inline-block align-middle ${className}`}
      style={{
        width: size,
        height: size,
        filter: isWhite ? "invert(1)" : "none",
      }}
    />
  );
};

export default CurrencyIcon;
