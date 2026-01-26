import riyal from "../assets/riyal.png";
import rupee from "../assets/rupee.png";

const CurrencyIcon = ({ size = 14, isWhite = false, className = "" }) => {
  const posUser = JSON.parse(localStorage.getItem("pos_user") || {});
  const country = (posUser?.restaurant?.country || "").toUpperCase();

  const icon = country === "INDIA" ? rupee : riyal;
  const alt = country === "INDIA" ? "INR" : "SAR";

  return (
    <img
      src={icon}
      alt={alt}
      className={`inline-block align-baseline flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        filter: isWhite ? "invert(1)" : "none",
      }}
    />
  );
};

export default CurrencyIcon;
