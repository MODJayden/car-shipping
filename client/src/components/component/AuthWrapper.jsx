import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthWrapper = ({ isAuth, user, children }) => {
  const location = useLocation();
  const path = location.pathname;

  // If user is not authenticated
  if (!isAuth) {
    if (path.startsWith("/admin")) return <Navigate to="/" />;
    return <div>{children}</div>; // allow public pages
  }

  // If authenticated
  if (isAuth) {
    // Redirect logged-in users away from login/signup
    if (path === "/login" || path === "/signup") {
      return user?.role === "admin" ? (
        <Navigate to="/admin/cars" />
      ) : (
        <Navigate to="/" />
      );
    }

    // Prevent user from accessing admin pages
    if (user?.role === "customer" && path.startsWith("/admin")) {
      return <Navigate to="/" />;
    }

    // Prevent admin from visiting user pages like home
    if (user?.role === "admin" && path === "/") {
      return <Navigate to="/admin/cars" />;
    }
  }

  return <div>{children}</div>;
};

export default AuthWrapper;
