import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
      ©️ All Rights Reserved By{" "}
      <a
        href="https://www.ex-ion.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-600 font-semibold hover:underline"
      >
        Ex-ion
      </a>{" "}
      {currentYear}
    </footer>
  );
};

export default Footer;
