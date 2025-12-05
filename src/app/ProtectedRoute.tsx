import { useAppSelector } from './store';
import { selectUser } from '../entities/User/model/store/userStore';
import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const user = useAppSelector(selectUser);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
