import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    const handleReload = () => {
      window.location.reload();
    };

    const handleGoHome = () => {
      window.location.href = '/';
    };

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC] p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle size={48} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-3">
              Xatolik yuz berdi
            </h1>
            <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed">
              Kutilmagan xatolik sodir bo'ldi. Iltimos, sahifani qayta yuklang
              yoki bosh sahifaga qayting.
            </p>
            {this.state.error && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
                <p className="text-xs font-mono text-gray-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReload}
                className="toy-bounce bg-[#4D96FF] text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-blue-100 flex items-center gap-2"
              >
                <RefreshCw size={18} /> Qayta yuklash
              </button>
              <button
                onClick={handleGoHome}
                className="toy-bounce bg-gray-100 text-gray-600 font-black px-6 py-3 rounded-2xl flex items-center gap-2"
              >
                <Home size={18} /> Bosh sahifa
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
