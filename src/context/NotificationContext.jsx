import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const success = useCallback((message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-slate-900/95 text-white shadow-fintech-lg rounded-xl pointer-events-auto flex items-center p-4 border border-teal-500/30 backdrop-blur-md`}
        >
          <div className="flex-shrink-0 text-teal-400 mr-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-3 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      ),
      { duration: 4000, ...options }
    );
  }, []);

  const error = useCallback((message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-slate-900/95 text-white shadow-fintech-lg rounded-xl pointer-events-auto flex items-center p-4 border border-rose-500/40 backdrop-blur-md`}
        >
          <div className="flex-shrink-0 text-rose-400 mr-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-3 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      ),
      { duration: 5000, ...options }
    );
  }, []);

  const warning = useCallback((message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-slate-900/95 text-white shadow-fintech-lg rounded-xl pointer-events-auto flex items-center p-4 border border-amber-500/40 backdrop-blur-md`}
        >
          <div className="flex-shrink-0 text-amber-400 mr-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-3 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      ),
      { duration: 4500, ...options }
    );
  }, []);

  const info = useCallback((message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-slate-900/95 text-white shadow-fintech-lg rounded-xl pointer-events-auto flex items-center p-4 border border-royal-500/40 backdrop-blur-md`}
        >
          <div className="flex-shrink-0 text-royal-400 mr-3">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-3 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      ),
      { duration: 4000, ...options }
    );
  }, []);

  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  return (
    <NotificationContext.Provider value={{ success, error, warning, info, dismiss }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'fintech-toast',
          style: {
            background: '#0d1f36',
            color: '#f8fafc',
            border: '1px solid #1e3a5f',
            borderRadius: '0.75rem',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          },
        }}
      />
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
