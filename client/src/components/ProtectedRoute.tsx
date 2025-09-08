import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import type { JSX } from 'react';

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) {
  const user = getCurrentUser();

  console.log(user);

  if (!user) {
    console.log('no');
    return <Navigate to='/login' replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return children;
}
