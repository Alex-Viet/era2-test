import { QueueProvider } from '@/app/providers/QueueProvider';
import { AppRouter } from '@/app/providers/AppRouter';
import '@/app/styles/index.css';

export function App() {
  return (
    <QueueProvider>
      <AppRouter />
    </QueueProvider>
  );
}
