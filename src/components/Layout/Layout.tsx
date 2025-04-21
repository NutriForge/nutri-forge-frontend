import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="bg-white flex-1 overflow-x-auto">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
