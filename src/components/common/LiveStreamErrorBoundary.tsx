import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class LiveStreamErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LiveStream Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-8 bg-gray-50">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Live Streaming Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">
                  Something went wrong with the live streaming interface.
                </p>
                <p className="text-red-700 text-sm">
                  This could be due to a temporary loading issue or component error.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Quick Solutions:</h4>
                <ul className="list-disc ml-4 space-y-1 text-sm text-gray-700">
                  <li>Refresh the page</li>
                  <li>Clear browser cache</li>
                  <li>Try logging out and back in</li>
                  <li>Check your internet connection</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a href="/influencer/dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </a>
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="text-xs text-gray-600">
                  <summary className="font-semibold cursor-pointer">
                    Developer Information
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded font-mono whitespace-pre-wrap">
                    <p><strong>Error:</strong> {this.state.error?.message}</p>
                    <p><strong>Stack:</strong></p>
                    <div className="max-h-32 overflow-y-auto">
                      {this.state.error?.stack}
                    </div>
                    {this.state.errorInfo && (
                      <>
                        <p><strong>Component Stack:</strong></p>
                        <div className="max-h-32 overflow-y-auto">
                          {this.state.errorInfo.componentStack}
                        </div>
                      </>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LiveStreamErrorBoundary;
