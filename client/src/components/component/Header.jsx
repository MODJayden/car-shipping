import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Menu,
  Car,
  Search,
  User,
  Heart,
  ShoppingCart,
  Bell,
  Truck,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetTokenAndCredential } from "../../store/user";
import NotificationDropdown from "./Notification";
import { getNotificationsByRecipient } from "../../store/notification";

const Header = ({ theme, setTheme }) => {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();
  const { user, isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const { recipientNotifications, unreadCount } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (!user?.id) return;
    dispatch(getNotificationsByRecipient(user?.id));
  }, [dispatch]);

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Cars", href: "/", icon: Car },
    { label: "Shipping", href: "/shipping", icon: Search },

    { label: "Finance", href: "/finance", icon: ShoppingCart },
    { label: "Orders", href: isAuth ? "/track" : "/login", icon: Truck },
    /* { label: "Account", href: isAuth ? "/account" : "/login", icon: User } */
    ,
  ];

  // Check if a nav item is active
  const isActive = (href) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  // Handle mobile navigation click
  const handleMobileNavClick = () => {
    setIsSheetOpen(false);
  };

  const handleLogout = () => {
    dispatch(resetTokenAndCredential());
    setIsSheetOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-xl bg-white/75 dark:bg-gray-900/80 shadow-lg border-b border-white/20 dark:border-gray-700/20"
          : "backdrop-blur-md bg-gray-100 dark:bg-gray-900/60"
      }`}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/10 dark:from-gray-800/10 dark:to-gray-800/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-700 p-2.5 rounded-xl shadow-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Shuqran LLC
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Global to Global
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-gray-900 dark:text-white"
                      : "hover:bg-white/20 dark:hover:bg-gray-800/20"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium transition-colors ${
                        active
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                  )}
                  {/* Hover effect */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-opacity duration-300 ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Wishlist */}
            {/*  <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
            >
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0">
                3
              </Badge>
            </Button>
 */}
            {/* Notifications */}
            {isAuth ? (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-500 text-white border-0">
                  {unreadCount}
                </Badge>
              </Button>
            ) : null}

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-10 w-10 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500 rotate-0 scale-100 transition-all" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600 rotate-0 scale-100 transition-all" />
              )}
            </Button>

            {/* Profile Button */}
            {isAuth ? (
              <Link to={"/login"}>
                <Button
                  variant="ghost"
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleLogout}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">Logout</span>
                </Button>
              </Link>
            ) : (
              <Link to={"/login"}>
                <Button
                  variant="ghost"
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Section */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile Dark Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </Button>

            {/* Mobile Menu Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-white/20 dark:border-gray-700/20"
              >
                <SheetHeader className="text-left pb-6 border-b border-gray-200/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-700 p-2 rounded-lg shadow-lg">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <SheetTitle className="text-lg font-bold text-gray-900 dark:text-white">
                        Shuqran LLC
                      </SheetTitle>
                      <SheetDescription className="text-sm text-gray-500 dark:text-gray-400">
                        Global to Africa
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                {/* Mobile Navigation */}
                <div className="py-6">
                  <nav className="space-y-2">
                    {navItems.map((item, index) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={index}
                          to={item.href}
                          onClick={handleMobileNavClick}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            active
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                              : "hover:bg-white/20 dark:hover:bg-gray-800/20"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              active
                                ? "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800/40 dark:to-purple-800/40"
                                : "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-800/40 dark:group-hover:to-purple-800/40"
                            }`}
                          >
                            <item.icon
                              className={`w-5 h-5 ${
                                active
                                  ? "text-blue-700 dark:text-blue-300"
                                  : "text-blue-600 dark:text-blue-400"
                              }`}
                            />
                          </div>
                          <span
                            className={`font-medium ${
                              active
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                          {active && (
                            <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <SheetFooter>
                  {/* Mobile Action Buttons */}
                  <div className="pt-6 mb-4 border-t border-gray-200/20 dark:border-gray-700/20 ">
                    {isAuth ? (
                      <Link to={"/login"}>
                        <Button
                          variant="ghost"
                          className="h-10 px-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={handleLogout}
                        >
                          <User className="w-4 h-4 mr-2" />
                          <span className="font-medium">Logout</span>
                        </Button>
                      </Link>
                    ) : (
                      <Link to={"/login"}>
                        <Button
                          variant="ghost"
                          className="h-10 px-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          <span className="font-medium">Sign In</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {/*  <Button
                      variant="ghost"
                      size="sm"
                      className="flex-col h-16 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30"
                    >
                      <Search className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        Search
                      </span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative flex-col h-16 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30"
                    >
                      <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        Wishlist
                      </span>
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white border-0">
                        3
                      </Badge>
                    </Button> */}

                    {isAuth ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative flex-col h-16 rounded-xl bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30"
                        onClick={() => setIsNotificationOpen(true)}
                      >
                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Alerts
                        </span>
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-blue-500 text-white border-0">
                          {unreadCount}
                        </Badge>
                      </Button>
                    ) : null}
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <NotificationDropdown
        isDialogOpen={isNotificationOpen}
        setIsDialogOpen={setIsNotificationOpen}
        notifications={recipientNotifications}
        unreadCount={unreadCount}
      />
    </header>
  );
};

export default Header;
