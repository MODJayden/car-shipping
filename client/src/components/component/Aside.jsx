import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  LayoutDashboard,
  Car,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  LogOut,
  User,
  ChevronRight,
  MoreHorizontal,
  HelpCircle,
  DollarSign,
  Plane,
  SheetIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { resetTokenAndCredential } from "../../store/user";

// Admin Sidebar Component
const AdminSidebar = ({ isCollapsed, onToggle, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetTokenAndCredential());
    navigate("/");
  };

  const menuItems = [
    /*   {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
      badge: null,
    }, */
    {
      icon: Car,
      label: "Car Management",
      path: "/admin/cars",
      /* badge: "23", */
    },
    {
      icon: SheetIcon,
      label: "Application Management",
      path: "/admin/customers",
      /* badge: "156", */
    },
    {
      icon: ShoppingCart,
      label: "Order Management",
      path: "/admin/orders",
      /*  badge: "12", */
      /* urgent: true, */
    },
    {
      icon: Plane,
      label: "Shipping Management",
      path: "/admin/shipping",
      /*  badge: "5",
      urgent: true, */
    },
    {
      icon: DollarSign,
      label: "Interest Rates",
      path: "/admin/interest-rates",
      /* badge: "9",
      urgent: false, */
    },
  ];

  /*   const utilityItems = [
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      path: "/admin/help",
    },
  ];
 */
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`${className} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur opacity-75" />
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-700 p-2.5 rounded-xl shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Shuqran LLC
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Management Portal
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Main Menu
              </p>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      active
                        ? "bg-white/20"
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active
                          ? "text-white"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    />
                  </div>

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge
                            className={`text-xs px-2 py-0.5 ${
                              active
                                ? "bg-white/20 text-white border-white/20"
                                : item.urgent
                                ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {active && <ChevronRight className="w-4 h-4" />}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <Separator className="my-6" />

          {/* Utility Navigation */}
          {/*  <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Utilities
              </p>
            )}
            {utilityItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      active
                        ? "bg-white/20"
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </div>
                  {!isCollapsed && (
                    <span className="flex-1 font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div> */}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                JA
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.firstName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Super Administrator
                </p>
              </div>
            )}
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSidebar;
