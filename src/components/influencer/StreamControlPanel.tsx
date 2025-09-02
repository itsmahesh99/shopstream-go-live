import React, { useState, useEffect } from 'react';
import { X, Users, Eye, Clock, TrendingUp, Package, Settings, Square, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLiveStreamMetrics, useSessionProducts } from '../../hooks/useLiveStream';
import { LiveSession } from '../../types/liveStream';
import { format } from 'date-fns';

interface StreamControlPanelProps {
  session: LiveSession;
  isOpen: boolean;
  onClose: () => void;
}

export const StreamControlPanel: React.FC<StreamControlPanelProps> = ({ 
  session, 
  isOpen, 
  onClose 
}) => {
  const { metrics, updateMetrics } = useLiveStreamMetrics(session.id, session.status === 'live');
  const { products } = useSessionProducts(session.id);
  const [streamDuration, setStreamDuration] = useState(0);

  // Calculate stream duration
  useEffect(() => {
    if (session.status === 'live' && session.actual_start_time) {
      const startTime = new Date(session.actual_start_time).getTime();
      
      const updateDuration = () => {
        const now = Date.now();
        const duration = Math.floor((now - startTime) / 1000 / 60);
        setStreamDuration(duration);
      };

      updateDuration();
      const interval = setInterval(updateDuration, 1000);
      
      return () => clearInterval(interval);
    }
  }, [session.status, session.actual_start_time]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusBadge = () => {
    switch (session.status) {
      case 'live':
        return <Badge className="bg-red-500 text-white">🔴 LIVE</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 text-white">Scheduled</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return <Badge variant="outline">{session.status}</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Stream Control Panel
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{session.title}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Live Metrics */}
          {session.status === 'live' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Current Viewers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics?.current_viewers || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Peak Viewers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics?.peak_viewers || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDuration(streamDuration)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Viewers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metrics?.total_unique_viewers || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stream Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stream Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Basic Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Title:</span>
                      <span className="ml-2 font-medium">{session.title}</span>
                    </div>
                    {session.description && (
                      <div>
                        <span className="text-gray-500">Description:</span>
                        <span className="ml-2">{session.description}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium capitalize">{session.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timing</h4>
                  <div className="space-y-2 text-sm">
                    {session.scheduled_start_time && (
                      <div>
                        <span className="text-gray-500">Scheduled:</span>
                        <span className="ml-2">
                          {format(new Date(session.scheduled_start_time), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}
                    {session.actual_start_time && (
                      <div>
                        <span className="text-gray-500">Started:</span>
                        <span className="ml-2">
                          {format(new Date(session.actual_start_time), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}
                    {session.end_time && (
                      <div>
                        <span className="text-gray-500">Ended:</span>
                        <span className="ml-2">
                          {format(new Date(session.end_time), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Products */}
          {products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Featured Products ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{item.product?.name}</h4>
                        {item.is_featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium">₹{item.special_price || item.product?.retail_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Clicks:</span>
                          <span>{item.clicks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Orders:</span>
                          <span>{item.orders_generated}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stream Controls */}
          {session.status === 'live' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Stream Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                  >
                    Add Product
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                  >
                    Manage Chat
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                  >
                    Stream Settings
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 min-w-[120px]"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End Stream
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stream Performance (for ended streams) */}
          {session.status === 'ended' && (
            <Card>
              <CardHeader>
                <CardTitle>Stream Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{session.duration_minutes || 0}</p>
                    <p className="text-sm text-gray-600">Minutes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{session.peak_viewers}</p>
                    <p className="text-sm text-gray-600">Peak Viewers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{session.total_unique_viewers}</p>
                    <p className="text-sm text-gray-600">Total Viewers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">₹{session.total_sales_generated}</p>
                    <p className="text-sm text-gray-600">Sales Generated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {session.status === 'live' && (
              <Button variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                End Stream
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
