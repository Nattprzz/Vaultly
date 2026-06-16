/**
 * AppErrorBoundary.tsx — error boundary global para errores de renderizado.
 *
 * Envuelve AppRoutes para interceptar cualquier excepción no controlada que
 * ocurra durante el render del árbol de componentes. Cuando se detecta un
 * error muestra la pantalla de error 500 en lugar de dejar la UI en blanco.
 * El botón "Reintentar" resetea el estado del boundary y recarga la página.
 *
 * Debe colocarse DENTRO de BrowserRouter para que los <Link> del
 * ErrorStatePage funcionen correctamente.
 */

// ─── React ───────────────────────────────────────────────────────────────────

import { Component, type ReactNode, type ErrorInfo } from 'react';

// ─── Componentes ──────────────────────────────────────────────────────────────

import ErrorStatePage from './ErrorStatePage';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Props    { children: ReactNode; }
interface State    { hasError: boolean; }

// ─── Componente ──────────────────────────────────────────────────────────────

export default class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AppErrorBoundary] Error no controlado:', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorStatePage
          code={500}
          title="Algo ha salido mal"
          description="Ha ocurrido un error inesperado al procesar la solicitud. Puedes intentarlo de nuevo o volver a una zona segura de Vaultly."
          icon="ri-error-warning-line"
          actions={[
            { label: 'Reintentar',   icon: 'ri-refresh-line',  onClick: this.handleRetry, variant: 'primary'    },
            { label: 'Ir al inicio', icon: 'ri-home-4-line',   to: '/',                   variant: 'secondary'  },
          ]}
        />
      );
    }

    return this.props.children;
  }
}
