import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border px-4">
      <div className="flex space-x-4">
        <a href="#" className="hover:text-[#56426C]">
          3D View
        </a>
      </div>

      <div className="flex items-center">
        <Image src={"/logo.png"} alt="The Logo" width={60} height={60} />
        <label htmlFor="agu-intel" className="hover:text-[#56426C]">
          Aquaintel
        </label>
      </div>

      <div className="flex space-x-4">
        <a href="#" className="hover:text-[#56426C]">
          About
        </a>
        <a href="#" className="hover:text-[#56426C]">
          Team
        </a>
      </div>
    </nav>
  );
}
