import React, { useState } from "react";
import { Link, useLocation, } from "react-router-dom";


// Type cho sub menu item
interface SubMenuItem {
  title: string;
  path: string;
}

// Type cho menu item
interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path: string;
  hasDropdown: boolean;
  subItems?: SubMenuItem[];
}

const SideBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const menuItems: MenuItem[] = [
  {
    id: "confirmed",
    title: "Confirmedmap",
    icon: "📊",
    path: "/",
    hasDropdown: false,
  },
  {
    id: "confirmedtree",
    title: "Confirmedtree",
    icon: "📊",
    path: "/tree",
    hasDropdown: false,
  },
  {
    id: "active",
    title: "Active",
    icon: "🔥",
    path: "/stats/active",
    hasDropdown: false,
  },
  {
    id: "recovered",
    title: "Recoveredmap",
    icon: "💚",
    path: "/stats/recovered",
    hasDropdown: false,
  },
  {
    id: "recoveredtree",
    title: "Recoveredtree",
    icon: "💚",
    path: "/stats/recoveredtree",
    hasDropdown: false,
  },
  {
    id: "deaths",
    title: "Deathsmap",
    icon: "⚰️",
    path: "/stats/deaths",
    hasDropdown: false,
  },
  {
    id: "deathstree",
    title: "DeathsTree",
    icon: "⚰️",
    path: "/stats/deathstree",
    hasDropdown: false,
  },
  {
    id: "daily-increase",
    title: "Daily Increase",
    icon: "📈",
    path: "/stats/daily-increase",
    hasDropdown: false,
  },
];


  const handleDropdownToggle = (itemId: string) => {
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const isActiveRoute = (path: string): boolean => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div
      className={`bg-[#FBF8EF] h-screen shadow-2xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#C9E6F0]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#78B3CE] rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <h2 className="text-[#78B3CE] font-bold text-lg">
                  Admin Portal
                </h2>
                <p className="text-gray-500 text-xs">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-[#C9E6F0] text-[#78B3CE] hover:bg-[#78B3CE] hover:text-white transition-colors duration-200"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <div>
                {item.hasDropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      isActiveRoute(item.path)
                        ? "bg-[#F96E2A] text-white shadow-lg"
                        : "text-[#78B3CE] hover:bg-[#C9E6F0]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span
                        className={`transition-transform duration-200 ${
                          activeDropdown === item.id ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      isActiveRoute(item.path)
                        ? "bg-[#F96E2A] text-white shadow-lg"
                        : "text-[#78B3CE] hover:bg-[#C9E6F0]"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="font-medium">{item.title}</span>
                    )}
                  </Link>
                )}
              </div>

              {/* Dropdown Menu */}
              {item.hasDropdown &&
                activeDropdown === item.id &&
                !isCollapsed &&
                item.subItems && (
                  <ul className="mt-2 ml-6 space-y-1">
                    {item.subItems.map((subItem, index) => (
                      <li key={index}>
                        <Link
                          to={subItem.path}
                          className={`block p-2 pl-4 rounded-lg text-sm transition-colors duration-200 ${
                            isActiveRoute(subItem.path)
                              ? "bg-[#F96E2A] text-white"
                              : "text-gray-600 hover:bg-[#C9E6F0] hover:text-[#78B3CE]"
                          }`}
                        >
                          • {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
            </li>
          ))}
        </ul>
      </nav>     
    </div>
  );
};

export default SideBar;
