// src/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LOGIN, SIGNUP, HOME } from "./utilities/constantLinks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedLayout from "./layouts/protectedLayout";
import UserLayout from "./layouts/userLayout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes under UserLayout */}
        <Route element={<UserLayout />}>
          <Route path={LOGIN} element={<Login />} />
          <Route path={SIGNUP} element={<Signup />} />
        </Route>

        {/* Protected Routes under ProtectedLayout */}
        <Route element={<ProtectedLayout />}>
          <Route path={HOME} element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
