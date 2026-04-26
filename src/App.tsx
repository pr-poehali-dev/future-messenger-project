
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { getCachedUser, getMe, User } from "./lib/auth";

const queryClient = new QueryClient();

function AuthGate() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const cached = getCachedUser();
    if (cached) {
      setUser(cached);
      setChecking(false);
      // Тихо обновляем данные из БД
      getMe().then(u => { if (u) setUser(u); }).catch(() => {});
    } else {
      getMe().then(u => {
        setUser(u);
      }).catch(() => {
        setUser(null);
      }).finally(() => setChecking(false));
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg" style={{ background: "var(--dark-bg)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-neon"
            style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
            <span className="font-orbitron font-black text-white text-xl">N</span>
          </div>
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(168,85,247,0.3)", borderTopColor: "#a855f7" }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  return <Index currentUser={user} onLogout={() => setUser(null)} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthGate />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;