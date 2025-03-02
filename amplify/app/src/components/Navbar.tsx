"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Advocates", path: "/all-lawyers" },
  { name: "Learn", path: "/learn" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="bg-[#1D1D1D] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center ">
          <Link href="/">
            <Image src="/favicon.png" height={20} width={60} alt="logo" />
          </Link>
          <Link href="/">
            <Image src="/unmask.png" height={20} width={100} alt="logo" />
          </Link>
        </div>
        <button
          className="md:hidden p-2 rounded focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <ul
          className={`md:flex space-x-6 md:space-x-6 absolute md:static bg-[#1D1D1D] w-full md:w-auto top-16 left-0 p-4 md:p-0 transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.path} className="md:inline-block">
              <Link
                href={link.path}
                className={`block px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800 ${
                  pathname === link.path ? "bg-gray-700" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              className="block px-4 py-2 rounded transition-all duration-300 hover:bg-gray-800"
              href={"https://unmask-agents.streamlit.app"}
              target="_blank"
            >
              Agents
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
