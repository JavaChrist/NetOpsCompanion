import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CommandsPage } from './pages/CommandsPage';
import { CommandDetailPage } from './pages/CommandDetailPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { DiagnosticDetailPage } from './pages/DiagnosticDetailPage';
import { ChecklistsPage } from './pages/ChecklistsPage';
import { ChecklistDetailPage } from './pages/ChecklistDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="commands" element={<CommandsPage />} />
          <Route path="commands/:id" element={<CommandDetailPage />} />
          <Route path="diagnostics" element={<DiagnosticsPage />} />
          <Route path="diagnostics/:id" element={<DiagnosticDetailPage />} />
          <Route path="checklists" element={<ChecklistsPage />} />
          <Route path="checklists/:id" element={<ChecklistDetailPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
