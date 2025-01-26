"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthWrapper({
  children,
  requireAuth = false,
  redirectTo = "/login",
}: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(redirectTo);
    }
  }, [loading, requireAuth, user, router, redirectTo]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
} 