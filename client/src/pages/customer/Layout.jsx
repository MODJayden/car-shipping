import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/component/Header";
import Footer from "../../components/component/Footer";

export default function Layout() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen flex flex-col">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
