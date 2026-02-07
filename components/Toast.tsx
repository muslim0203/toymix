import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, X, AlertCircle, Info, ShoppingBag } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'cart';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-24 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />,
    cart: <ShoppingBag size={20} className="text-[#4ECDC4]" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100',
    cart: 'bg-teal-50 border-teal-100',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl max-w-sm ${bgColors[toast.type]} ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}
    >
      {icons[toast.type]}
      <span className="text-sm font-bold text-gray-700 flex-1">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-gray-300 hover:text-gray-500 transition-colors p-1"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default ToastProvider;
