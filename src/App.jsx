import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import LogoutConfirmModal from './components/auth/LogoutConfirmModal';
import QuickTransferModal from './components/common/QuickTransferModal';
import NovaAiAssistant from './components/common/NovaAiAssistant';
import NotificationsDrawer from './components/common/NotificationsDrawer';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <BankingProvider>
              <BrowserRouter>
                <AppRoutes />

                {/* Centralized Global Dialogs & Assistants */}
                <LogoutConfirmModal />
                <QuickTransferModal />
                <NovaAiAssistant />
                <NotificationsDrawer />
              </BrowserRouter>
            </BankingProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
