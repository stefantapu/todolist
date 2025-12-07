import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About } from '../entities/App/ui/About.tsx';
import NotFound from '../entities/App/ui/NotFound.tsx';
import Layout from '../entities/App/ui/Layout.tsx';
import Auth from '../entities/User/ui/Auth.tsx';
import Todos from '../entities/Todo/ui/Todos.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { BlockAuthPage } from './blockAuthPage.tsx';
import Profile from '../entities/User/ui/Profile.tsx';
import ErrorHandler from '../entities/App/ui/ErrorHandler.tsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorHandler>
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Todos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth"
              element={
                <BlockAuthPage>
                  <Auth />
                </BlockAuthPage>
              }
            />
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorHandler>
    </BrowserRouter>
  );
}
