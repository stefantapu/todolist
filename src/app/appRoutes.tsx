import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About } from '../entities/App/ui/About.tsx';
import NotFound from '../entities/App/ui/NotFound.tsx';
import Layout from '../entities/App/ui/Layout.tsx';
import Auth from '../entities/User/ui/Auth.tsx';
import Todos from '../entities/Todo/ui/Todos.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';
import { BlockAuthPage } from './BlockAuthOnLoggedIn.tsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
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
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
