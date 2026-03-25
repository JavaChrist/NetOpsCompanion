import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthGuard } from './components/auth/AuthGuard';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
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
import { GenetecPage } from './pages/genetec/GenetecPage';
import { GenetecOverviewPage } from './pages/genetec/GenetecOverviewPage';
import { GenetecCamerasPage } from './pages/genetec/GenetecCamerasPage';
import { GenetecAccessControlPage } from './pages/genetec/GenetecAccessControlPage';
import { GenetecLogsPage } from './pages/genetec/GenetecLogsPage';
import { GenetecMaintenancePage } from './pages/genetec/GenetecMaintenancePage';
import { GenetecChecklistsPage } from './pages/genetec/GenetecChecklistsPage';
import { GenetecFaqPage } from './pages/genetec/GenetecFaqPage';
import { GenetecProcedurePage } from './pages/genetec/GenetecProcedurePage';
import { GenetecDiagnosticPage } from './pages/genetec/GenetecDiagnosticPage';
import { useSettingsStore } from './store';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { theme } = useSettingsStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="commands" element={<CommandsPage />} />
            <Route path="commands/:id" element={<CommandDetailPage />} />
            <Route path="diagnostics" element={<DiagnosticsPage />} />
            <Route path="diagnostics/:id" element={<DiagnosticDetailPage />} />
            <Route path="checklists" element={<ChecklistsPage />} />
            <Route path="checklists/:id" element={<ChecklistDetailPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="genetec" element={<GenetecPage />} />
            <Route path="genetec/overview" element={<GenetecOverviewPage />} />
            <Route path="genetec/cameras" element={<GenetecCamerasPage />} />
            <Route path="genetec/access-control" element={<GenetecAccessControlPage />} />
            <Route path="genetec/logs" element={<GenetecLogsPage />} />
            <Route path="genetec/maintenance" element={<GenetecMaintenancePage />} />
            <Route path="genetec/checklists" element={<GenetecChecklistsPage />} />
            <Route path="genetec/faq" element={<GenetecFaqPage />} />
            <Route path="genetec/procedure/:id" element={<GenetecProcedurePage />} />
            <Route path="genetec/diagnostic/:id" element={<GenetecDiagnosticPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
