import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Admin Panel:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', color: '#F8FAFC', backgroundColor: '#0F172A', minHeight: '100vh', textAlign: 'center' }}>
          <h2>⚠️ Ocurrió un error al cargar el Panel Administrador</h2>
          <p style={{ color: '#94A3B8' }}>{this.state.error?.message}</p>
          <button
            onClick={() => {
              localStorage.removeItem('nexotv_admin_channels');
              window.location.reload();
            }}
            style={{ padding: '12px 24px', backgroundColor: '#3B82F6', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', marginTop: 20 }}
          >
            🔄 Restablecer Caché y Recargar Panel
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
