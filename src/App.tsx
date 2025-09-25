import { Outlet } from "react-router";
import { Header } from "./components/Header";
import Footer from "@/components/Footer"; // Corrected import
import { Toaster } from "./components/ui/sonner";
import { AnimationContext } from "./context/AnimationContext"; // import context
import { useAuthStore } from "./features/auth/sessionStore";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const { cartIconRef } = useAuthStore();

  return (
    <AnimationContext.Provider value={{ cartIconRef }}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Toaster richColors position="top-center" />
        <main className="flex-grow w-full">
          <ScrollToTop />
          <div className="w-full mx-auto max-w-[1200px] min-[1200px]:px-[32px] px-4 sm:px-8 py-6">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </AnimationContext.Provider>
  );
}

export default App;
