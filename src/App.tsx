
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
  const [user, setUser] = useState<User | null>(() => getCachedUser());

  useEffect(() => {
    // Тихо обновляем данные из БД если есть кеш
    getMe().then(u => { if (u) setUser(u); }).catch(() => {});
  }, []);

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  return <Index currentUser={user} onLogout={() => { setUser(null); }} />;
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