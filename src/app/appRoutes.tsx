import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About } from '../entities/App/ui/About.tsx';
import NotFound from '../entities/App/ui/NotFound.tsx';
import Layout from '../entities/App/ui/Layout.tsx';
import Auth from '../entities/User/ui/Auth.tsx';
import Profile from '../entities/User/ui/Profile.tsx';
import ErrorHandler from '../entities/App/ui/ErrorHandler.tsx';
import Redirector from '../entities/App/ui/Redirector.tsx';
import SingleTodoPage from '../entities/Todo/ui/SingleTodoPage.tsx';
import App from './App.tsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorHandler>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<Redirector />}>
              <Route path="/" element={<App />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/todo/:id" element={<SingleTodoPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorHandler>
    </BrowserRouter>
  );
}
