import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { QueuePage } from '@/pages/QueuePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/queue" element={<QueuePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
