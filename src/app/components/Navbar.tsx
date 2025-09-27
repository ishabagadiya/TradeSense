"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectWallet } from "./ConnectWallet/ConnectWallet";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 bg-black/20 backdrop-blur-xl shadow-2xl w-full">
        <div className="w-[90%] mx-auto flex items-center justify-between h-20  rouborder-slate-200 dark:border-slate-700 nded-b-3xl">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300"
          >
            <div className="relative w-[150px] h-max">
              <Image
                src="/logo.svg"
                alt="TradeSense Logo"
                width={40}
                height={40}
                className="w-full h-auto group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Connect Wallet */}
            <ConnectWallet />
        </div>
    </nav>
  );
}
