import React from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

const PrivateLayout = (): React.JSX.Element => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
