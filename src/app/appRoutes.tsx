import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContent } from './App.tsx';
import { About } from '../entities/App/ui/About.tsx';
import NotFound from '../entities/App/ui/NotFound.tsx';
import Layout from '../entities/App/ui/Layout.tsx';
import Auth from '../entities/User/ui/Auth.tsx';
import Todos from '../entities/Todo/ui/Todos.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<AppContent />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
