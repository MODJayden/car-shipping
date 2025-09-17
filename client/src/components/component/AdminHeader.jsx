import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Shield,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resetTokenAndCredential } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";

// Admin Header Component
const AdminHeader = ({ onSidebarToggle, sidebarCollapsed,theme,setTheme }) => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { user, isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark");
  };

  const getPageTitle = () => {
    const pathMap = {
      "/admin/dashboard": "Dashboard Overview",
      "/admin/cars": "Car Management",
      "/admin/customers": "Application Management",
      "/admin/orders": "Order Management",
      "/admin/shipping": "Shipping Management",
      "/admin/interest-rates": "Interest Rates",
    };
    return pathMap[location.pathname] || "Admin Panel";
  };

  const getBreadcrumb = () => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" / ");
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>

          {/* Page Info */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
            {/*  <p className="text-sm text-gray-500 dark:text-gray-400">
              {getBreadcrumb()}
            </p> */}
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search cars, customers, orders..."
              className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>

          {/* Notifications */}
         {/*  <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0 animate-pulse">
              3
            </Badge>
          </Button> */}

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-10 w-10 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </Button>

          {/* Quick Stats */}
        {/*   <div className="hidden lg:flex items-center space-x-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Today's Sales
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  $24.5k
                </p>
              </div>
            </div>
          </div> */}

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                      {user?.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Administrator
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Security
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2 text-gray-600" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Home className="w-4 h-4 mr-2 text-purple-600" />
                View Site
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400"
                onClick={() => dispatch(resetTokenAndCredential())}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
