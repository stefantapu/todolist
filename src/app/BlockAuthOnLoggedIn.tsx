import { Navigate } from 'react-router-dom';
import { selectUser } from '../entities/User/model/store/userStore';
import { useAppSelector } from './store';
import { type PropsWithChildren } from 'react';

export const BlockAuthPage = ({ children }: PropsWithChildren) => {
  const user = useAppSelector(selectUser);

  if (user) {
    // User is logged in, redirect to home page
    return <Navigate to="/" replace />;
  }

  // User is not logged in, render the children (Auth component)
  return children;
};
