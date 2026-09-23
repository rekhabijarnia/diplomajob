import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'shortlist' | 'gov' | 'drive';
  unread: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectAction: (type: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 bg-on-surface/40 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in slide-in-from-top-4 duration-200">
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications</span>
            <h3 className="text-sm font-bold text-on-surface">Campus & Plant Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-primary hover:underline font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-on-surface-variant hover:text-on-surface rounded-md"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-surface-container max-h-[70vh] overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onSelectAction(notif.type);
                onClose();
              }}
              className={`p-3.5 hover:bg-surface-container/60 cursor-pointer transition-colors ${
                notif.unread ? 'bg-primary-fixed/20' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${
                    notif.type === 'drive'
                      ? 'bg-primary'
                      : notif.type === 'gov'
                      ? 'bg-secondary'
                      : notif.type === 'shortlist'
                      ? 'bg-tertiary'
                      : 'bg-error'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {notif.type === 'drive'
                      ? 'campaign'
                      : notif.type === 'gov'
                      ? 'account_balance'
                      : notif.type === 'shortlist'
                      ? 'check_circle'
                      : 'warning'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="text-xs font-bold text-on-surface truncate">{notif.title}</p>
                    <span className="text-[10px] text-on-surface-variant shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{notif.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-surface-container-low text-center border-t border-surface-container">
          <p className="text-[11px] text-on-surface-variant">
            WhatsApp SMS & Notification Dispatch Active
          </p>
        </div>
      </div>
    </div>
  );
};
