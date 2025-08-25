import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import PublicDashboard from "./components/PublicDashboard";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<{ type: 'admin' | 'public'; username: string } | null>(null);

  // Check for saved user session
  useEffect(() => {
    const savedUser = localStorage.getItem('memorialParkUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userType: 'admin' | 'public', username: string) => {
    const userData = { type: userType, username };
    setUser(userData);
    localStorage.setItem('memorialParkUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('memorialParkUser');
  };

  // If not logged in, show login page
  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Login onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                user.type === 'admin' ? (
                  <Dashboard username={user.username} onLogout={handleLogout} />
                ) : (
                  <PublicDashboard username={user.username} onLogout={handleLogout} />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
