

import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => {
    const baseClasses = "flex items-center px-4 py-3 text-gray-600 transform transition-colors duration-200";
    const activeClasses = "bg-green-100 text-aena-green border-r-4 border-aena-green font-semibold";
    const inactiveClasses = "hover:bg-gray-200 hover:text-gray-800";

    return (
        <NavLink
            to={to}
            end={to === '/'} // Use `end` only for the home route
            className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="mx-4">{children}</span>
        </NavLink>
    );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="z-30 flex-shrink-0 w-64 h-full flex flex-col bg-white border-r">
        <div className="h-16 flex items-center justify-center px-4 border-b text-center">
            <span className="text-lg font-semibold text-gray-700">Portal Integrador</span>
        </div>
        <nav className="flex-1 py-4">
            {/* FIX: Add missing 'children' prop to NavItem components. */}
            <NavItem to="/" icon={<DashboardIcon />}>
                Inicio
            </NavItem>
            <NavItem to="/aeropuertos" icon={<AirportIcon />}>
                Aeropuertos
            </NavItem>
            <NavItem to="/requisitos" icon={<RequirementsIcon />}>
                Requisitos de Información
            </NavItem>
        </nav>
        <div className="px-4 py-4 border-t">
            <p className="text-xs text-gray-500">&copy; 2024 Aena S.M.E., S.A.</p>
        </div>
    </aside>
  );
};

const DashboardIcon = () => (
    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const AirportIcon = () => (
    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-4h1m-1-4h1" />
    </svg>
)

const RequirementsIcon = () => (
    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


export default Sidebar;