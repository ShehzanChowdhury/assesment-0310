                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "use client";
import React from 'react';
import { onGlobalError } from '@/@utils';

type Toast = { id: number; message: string };

type Ctx = {
  show: (message: string) => void;
};

const ToastContext = React.createContext<Ctx | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const show = React.useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  // Subscribe to global error notifications
  React.useEffect(() => {
    const unsubscribe = onGlobalError((msg) => {
      show(msg || 'Failed to fetch');
    });
    return unsubscribe;
  }, [show]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast show mb-2 border border-2 border-danger shadow-lg"
            role="alert"
            style={{ backgroundColor: '#dc3545', color: 'white', minWidth: 280 }}
          >
            <div className="d-flex align-items-center">
              <div className="px-2 py-2 d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
                <span className="toast-body fw-semibold">{t.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white ms-auto me-2"
                aria-label="Close"
                onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}


