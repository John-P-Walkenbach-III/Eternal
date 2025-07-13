import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If no user is logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  return children; // If a user is logged in, render the page they were trying to access
}

export default ProtectedRoute;
