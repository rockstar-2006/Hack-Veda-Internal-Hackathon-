"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileLoading, setProfileLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Hardcoded Admin Session Check (Local Persistence)
    const isAdminSessionActive = typeof window !== 'undefined' && localStorage.getItem('adminSession') === 'active';

    if (requireAdmin && isAdminSessionActive) {
        setAuthorized(true);
        setProfileLoading(false);
        return;
    }

    if (!user && !isAdminSessionActive) {
      if (pathname !== "/login" && !pathname.startsWith("/admin/login")) {
        router.replace("/login");
      }
      return;
    }

    // Role check logic for regular sessions
    const checkRole = async () => {
      try {
        if (!requireAdmin) {
          setAuthorized(true);
          setProfileLoading(false);
          return;
        }

        // Check Firestore for admin role if no local session exists
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const profile = userSnap.data() as UserProfile;
                if (profile.role !== "admin") {
                    router.replace("/profile");
                } else {
                    setAuthorized(true);
                    setProfileLoading(false);
                }
            } else {
                router.replace("/profile");
            }
        } else {
            router.replace("/admin/login");
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        if (!requireAdmin) {
            setAuthorized(true);
            setProfileLoading(false);
        } else {
            router.replace("/profile");
        }
      }
    };

    checkRole();
  }, [user, loading, requireAdmin, pathname, router]);

  if ((loading || profileLoading) && pathname !== "/login" && !pathname.startsWith("/admin/login")) {
    return null; // Handled by LayoutWrapper loading state
  }

  return authorized || (pathname === "/login" || pathname === "/admin/login") ? <>{children}</> : null;
};
