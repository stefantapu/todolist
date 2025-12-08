import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loadUserFromLS } from '../../../shared/util/loadUserFromLS';
import { selectUser, setUser } from '../../User/model/store/userStore';

const Redirector = () => {
  const user = useAppSelector(selectUser);
  const userFromLS = loadUserFromLS();
  const dispatch = useAppDispatch();

  if (!user && !userFromLS) {
    return <Navigate to="/auth"></Navigate>;
  }
  if (!user && userFromLS) {
    dispatch(setUser(userFromLS));
  }
  return <Outlet />;
};
export default Redirector;
