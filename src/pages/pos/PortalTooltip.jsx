import { createPortal } from "react-dom";

const PortalTooltip = ({ children }) => {
  return createPortal(children, document.body);
};

export default PortalTooltip;
