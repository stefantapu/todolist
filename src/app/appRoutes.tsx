import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContent } from './App.tsx';
import { About } from '../entities/App/ui/About.tsx';
import NotFound from '../entities/App/ui/NotFound.tsx';
import Layout from '../entities/App/ui/Layout.tsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<AppContent />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
