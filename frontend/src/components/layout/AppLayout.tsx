"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { authApi } from "@/lib/api";

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = false }: AppLayoutProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, error } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authApi
        .me()
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          if (requireAuth) {
            router.push("/auth/login");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      if (requireAuth) {
        router.push("/auth/login");
      }
    }
  }, [requireAuth, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
    error("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar for non-dashboard pages */}
      {!isDashboard && !isAuthPage && (
        <Navbar user={user} onLogout={handleLogout} />
      )}

      <div className={cn("flex", isDashboard && "pt-0", !isDashboard && !isAuthPage && "pt-20")}>
        {/* Sidebar for dashboard */}
        {isDashboard && <Sidebar />}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1",
            isDashboard && "p-6 lg:p-8",
            !isDashboard && !isAuthPage && "px-4 sm:px-6 lg:px-8 pb-12"
          )}
        >
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

import { cn } from "@/lib/utils";
