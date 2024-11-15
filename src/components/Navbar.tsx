
import React, { useState } from "react";

import { Link } from "react-router-dom";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { client } from "../client";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const account = useActiveAccount();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-slate-100 border-b-2 z-0 border-b-slate-300 shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    
                    {/* Logo and Campaigns Link */}
                    <div className="flex items-end">
  <h1 className="text-3xl font-bold">
    <span className="text-black">Crowd</span>
    <span className="text-blue-600">Funding</span>
  </h1>
</div>


                    {/* Right Section with Connect Button and Menu Icon */}
                    <div className="flex items-center space-x-4">
                        {/* Links and Connect Button for larger screens */}
                        <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 text-sm font-medium hover:text-purple-600">
                            Campaigns
                        </Link>
                            {account && (
                                <Link to={`/dashboard/${account.address}`} className="text-gray-700 text-sm font-medium hover:text-purple-600">
                                    Dashboard
                                </Link>
                            )}
                            <ConnectButton 
                                client={client} 
                                theme={lightTheme()} 
                                detailsButton={{ style: { maxHeight: "50px" } } } 
                            />
                        </div>

                        {/* Hamburger Icon for mobile view */}
                        <button 
                            onClick={toggleMenu} 
                            className="md:hidden text-gray-700 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="space-y-1 pt-2 pb-3">
                            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-slate-200">
                                Campaigns
                            </Link>
                            {account && (
                                <Link to={`/dashboard/${account.address}`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-slate-200">
                                    Dashboard
                                </Link>
                            )}
                         <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-slate-200">
    <ConnectButton 
        client={client} 
        theme={lightTheme()} 
        detailsButton={{ style: { maxHeight: "40px" } }} 
    />
</div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
