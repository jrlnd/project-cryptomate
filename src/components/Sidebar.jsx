// import { useState } from 'react'
import { NavLink } from "react-router-dom";

import {
  HomeIcon,
  CashIcon,
  PresentationChartLineIcon,
  NewspaperIcon,
} from "@heroicons/react/solid";

import logo from "../images/currency-logo.svg";

const Sidebar = () => {
  // const [showNav, setShowNav] = useState(false)

  const iconClass = "h-7 w-7 text-neutral-50";

  const links = [
    { name: "Home", href: "/", icon: <HomeIcon className={iconClass} /> },
    {
      name: "Cryptocurrencies",
      href: "/currencies",
      icon: <CashIcon className={iconClass} />,
    },
    {
      name: "Exchanges",
      href: "/exchanges",
      icon: <PresentationChartLineIcon className={iconClass} />,
    },
    {
      name: "News",
      href: "/news",
      icon: <NewspaperIcon className={iconClass} />,
    },
  ];

  return (
    <nav className="bg-gray-800 h-16 md:h-full w-full md:w-72 fixed top-0 left-0 flex md:flex-col z-50">
        {/* Logo + Header */}

        <NavLink as="div" to="/" className="flex items-center justify-start mx-6 md:my-12">
          <img className="h-8" src={logo} alt="Cryptomate" />
          <span className="text-neutral-50 text-3xl font-black ml-3 hidden md:block">
            Cryptomate
          </span>
        </NavLink>
        

        <div className="flex md:flex-col ml-auto md:ml-0">
        {/* Navigation Links */}
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.href}
            className={({ isActive }) =>
              "flex items-center justify-center md:justify-start p-6 md:my-1 " +
              (isActive ? "bg-gray-600" : "transition-colors hover:bg-gray-700")
            }
          >
            <span>{link.icon}</span>
            <span className="text-neutral-50 text-lg font-medium ml-4 hidden md:block">
              {link.name}
            </span>
          </NavLink>
        ))}
        </div>
    </nav>
  );
};

export default Sidebar;
