import { redirect } from 'next/navigation';

export default function AuthWrapper({ children, user, requireAuth = false }) {
  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !user) {
    redirect('/login');
  }

  // If user is authenticated or authentication is not required, render children
  return children;
}