                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "use client";
import React from 'react';

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
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} className="toast align-items-center text-bg-dark show mb-2" role="alert">
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}


