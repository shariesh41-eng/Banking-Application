import React from 'react';
import { useBanking } from '../../hooks/useBanking';
import { formatDate } from '../../utils/formatters';
import {
  Bell,
  X,
  CheckCircle,
  ArrowLeftRight,
  ShieldCheck,
  MessageSquare,
  Landmark,
  CheckCheck,
} from 'lucide-react';
import { Badge } from './Badge';

export function NotificationsDrawer() {
  const {
    notifications,
    unreadNotificationsCount,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useBanking();

  if (!isNotificationDrawerOpen) return null;

  const categoryIcons = {
    transfer: ArrowLeftRight,
    complaint: MessageSquare,
    security: ShieldCheck,
    account: Landmark,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0c1626] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Notifications & Live Alerts
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {unreadNotificationsCount} unread alerts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-royal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Read All
                </button>
              )}
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No notifications recorded</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = categoryIcons[notif.category] || Bell;

                return (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && markNotificationAsRead(notif.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      notif.read
                        ? 'bg-white dark:bg-[#0c1626] border-slate-100 dark:border-slate-800/60 opacity-80'
                        : 'bg-royal-50/40 dark:bg-royal-950/20 border-royal-200 dark:border-royal-800/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                          notif.read
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            : 'bg-royal-600 text-white shadow-sm'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {notif.message}
                        </p>

                        <span className="block font-mono text-[10px] text-slate-400 mt-2">
                          {formatDate(notif.timestamp, 'full')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsDrawer;
