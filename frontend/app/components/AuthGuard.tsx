'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../authStore';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    const isProtectedRoute = pathname.startsWith('/recruiter') || pathname.startsWith('/candidate');
    const isLoginPage = pathname === '/';

    if (!token || !user) {
      // Not authenticated
      if (isProtectedRoute) {
        router.replace('/');
      }
    } else {
      // Authenticated
      if (isLoginPage) {
        // Redirect to their respective portal
        if (user.role === 'recruiter') {
          router.replace('/recruiter');
        } else if (user.role === 'candidate') {
          router.replace('/candidate/dashboard');
        }
      } else {
        // Role check
        if (user.role === 'recruiter' && pathname.startsWith('/candidate')) {
          router.replace('/recruiter');
        } else if (user.role === 'candidate' && pathname.startsWith('/recruiter')) {
          router.replace('/candidate/dashboard');
        }
      }
    }
  }, [user, token, isLoading, pathname, router]);

  // Prevent flicker/rendering protected contents if user doesn't have the right role
  const isProtectedRoute = pathname.startsWith('/recruiter') || pathname.startsWith('/candidate');
  const isLoginPage = pathname === '/';

  // Render a sleek, premium loading screen while checking authentication status to avoid content flashing
  if (isLoading && isProtectedRoute) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin" />
        </div>
        <p className="text-slate-400 font-medium text-xs tracking-wider uppercase animate-pulse">
          Loading Platform...
        </p>
      </div>
    );
  }
  
  if (!token || !user) {
    if (isProtectedRoute) {
      return null;
    }
  } else {
    if (isLoginPage) {
      return null;
    }
    if (user.role === 'recruiter' && pathname.startsWith('/candidate')) {
      return null;
    }
    if (user.role === 'candidate' && pathname.startsWith('/recruiter')) {
      return null;
    }
  }

  return <>{children}</>;
};
