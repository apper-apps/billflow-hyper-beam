import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Clients", href: "/clients", icon: "Users" },
    { name: "Services", href: "/services", icon: "Package" },
    { name: "Bills", href: "/bills", icon: "FileText" },
    { name: "Quotations", href: "/quotations", icon: "Quote" },
    { name: "Payments", href: "/payments", icon: "CreditCard" },
    { name: "Settings", href: "/settings", icon: "Settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <ApperIcon name="Receipt" className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BillFlow Pro
              </h1>
              <p className="text-xs text-gray-500">Agency Billing</p>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
              >
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    "group-hover:text-indigo-600"
                  )}
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-50 flex transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex-shrink-0 w-64">
          <div className="flex flex-col h-full bg-white shadow-xl">
            <div className="flex items-center justify-between flex-shrink-0 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <ApperIcon name="Receipt" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    BillFlow Pro
                  </h1>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )
                  }
                >
                  <ApperIcon 
                    name={item.icon} 
                    className="mr-3 h-5 w-5 transition-colors group-hover:text-indigo-600"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-1 w-0" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;