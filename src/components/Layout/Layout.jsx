import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        <Header />

        <main className="mt-14 ml-65 p-3 bg-gray-100 min-h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
