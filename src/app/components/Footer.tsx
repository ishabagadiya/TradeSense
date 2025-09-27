"use client"

import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-black p-2">
          
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} TradeSense. All rights reserved.
            </p>
          </div>
    </footer>
  );
};

export default Footer;