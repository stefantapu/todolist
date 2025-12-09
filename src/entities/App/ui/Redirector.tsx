import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { loadUserFromLS } from '../../../shared/util/loadUserFromLS';
import { selectUser, setUser } from '../../User/model/store/userStore';

const Redirector = () => {
  const user = useAppSelector(selectUser);
  const userFromLS = loadUserFromLS();
  const dispatch = useAppDispatch();
  const location = useLocation();

  if (!user && !userFromLS) {
    const back = encodeURIComponent(location.pathname);
    return <Navigate to={`/auth${back ? `?back=${back}` : ''}`} replace />;
  }
  if (!user && userFromLS) {
    dispatch(setUser(userFromLS));
  }
  return <Outlet />;
};
export default Redirector;
