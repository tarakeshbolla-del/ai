
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';

// Lazy load pages
const HomePage = lazy(() => import('./pages/User/HomePage'));
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/Admin/DashboardPage'));
const AnalyticsPage = lazy(() => import('./pages/Admin/AnalyticsPage'));
const KnowledgeBasePage = lazy(() => import('./pages/Admin/KnowledgeBasePage'));
const SettingsPage = lazy(() => import('./pages/Admin/SettingsPage'));


const App: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg"><Loader /></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
