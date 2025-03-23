// src/components/UserLayout.tsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { HOME } from "../utilities/constantLinks";

const UserLayout: React.FC = () => {
  const AuthReducer = useSelector((Data: any) => Data.auth.isLoggedIn);
  console.log("🚀 ~ AuthReducer:", AuthReducer);
  return <>{!AuthReducer ? <Outlet /> : <Navigate to={HOME} />}</>;
};

export default UserLayout;
