"use client"

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
         {/* Bottom Section */}
          <div className="pt-3 border-t border-gray-800">
            <div className="flex justify-center items-center gap-4">
              <p className="text-sm text-gray-500">
                © 2025 TradeSense. All rights reserved.
              </p>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;