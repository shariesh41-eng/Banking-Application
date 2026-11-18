import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { LogOut, ShieldAlert, AlertTriangle } from 'lucide-react';

export function LogoutConfirmModal() {
  const { user, isLogoutModalOpen, setIsLogoutModalOpen, logout } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    const roleName = user?.role || 'user';
    logout();
    success(`Signed out successfully. Session terminated.`);
    navigate('/auth/login');
  };

  return (
    <Modal
      isOpen={isLogoutModalOpen}
      onClose={() => setIsLogoutModalOpen(false)}
      title="Confirm Platform Sign Out"
      description="You are about to terminate your active encrypted banking session."
      size="sm"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Security Notice
            </p>
            <p className="leading-relaxed">
              Your security tokens will be invalidated immediately. Any unsaved drafts or wire forms will be discarded.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Active Identity:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {user?.name || 'Authorized User'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Security Clearance:</span>
            <span className="font-mono text-royal-600 dark:text-teal-400 uppercase">
              {user?.role || 'Guest'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsLogoutModalOpen(false)}
          >
            Stay Signed In
          </Button>

          <Button
            variant="danger"
            icon={LogOut}
            onClick={handleConfirmLogout}
          >
            Confirm Sign Out
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default LogoutConfirmModal;
