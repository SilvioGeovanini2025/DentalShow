import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // se não usar, pode remover

type PrivateLayoutProps = {
  children: ReactNode;
};

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default PrivateLayout;
