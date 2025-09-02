import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Key, ExternalLink, AlertCircle } from 'lucide-react';

interface TokenInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (authToken: string, roomCode?: string, viewerAuthToken?: string, viewerRoomCode?: string) => Promise<void>;
  influencer: {
    id: string;
    email: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
  } | null;
  isLoading: boolean;
}

export const TokenInputModal: React.FC<TokenInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  influencer,
  isLoading
}) => {
  const [authToken, setAuthToken] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [viewerAuthToken, setViewerAuthToken] = useState('');
  const [viewerRoomCode, setViewerRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!authToken.trim()) {
      setError('Broadcaster auth token is required');
      return;
    }

    try {
      await onSubmit(
        authToken.trim(), 
        roomCode.trim() || undefined,
        viewerAuthToken.trim() || undefined,
        viewerRoomCode.trim() || undefined
      );
      setAuthToken('');
      setRoomCode('');
      setViewerAuthToken('');
      setViewerRoomCode('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save auth token');
    }
  };

  const handleClose = () => {
    setAuthToken('');
    setRoomCode('');
    setViewerAuthToken('');
    setViewerRoomCode('');
    setError('');
    onClose();
  };

  const influencerName = influencer?.display_name || 
    `${influencer?.first_name || ''} ${influencer?.last_name || ''}`.trim() || 
    influencer?.email || 'Unknown';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            Set HMS Auth Token
          </DialogTitle>
          <DialogDescription>
            Manually input the auth token from 100ms dashboard for{' '}
            <span className="font-medium text-gray-900">{influencerName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">How to get 100ms Auth Token:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to your 100ms Dashboard</li>
                  <li>Navigate to Roles & Permissions</li>
                  <li>Create or select a broadcaster role</li>
                  <li>Generate auth token for this influencer</li>
                  <li>Copy the token and paste it below</li>
                </ol>
                <a 
                  href="https://dashboard.100ms.live" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Open 100ms Dashboard <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Broadcaster Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Badge variant="default" className="bg-purple-600">Broadcaster</Badge>
                <span className="text-sm text-gray-600">For the influencer to stream</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authToken">
                  HMS Auth Token <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="authToken"
                  placeholder="Paste broadcaster auth token here..."
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="min-h-[80px] font-mono text-sm"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  JWT token for broadcaster role from 100ms dashboard
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomCode">
                  Room Code <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="roomCode"
                  placeholder="e.g., ROOM_LIVE_001 (auto-generated if empty)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Leave empty to auto-generate a unique room code
                </p>
              </div>
            </div>

            {/* Viewer Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Badge variant="outline" className="border-green-600 text-green-600">Viewer</Badge>
                <span className="text-sm text-gray-600">For customers to watch the stream</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="viewerAuthToken">
                  Viewer HMS Auth Token <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="viewerAuthToken"
                  placeholder="Paste viewer auth token here..."
                  value={viewerAuthToken}
                  onChange={(e) => setViewerAuthToken(e.target.value)}
                  className="min-h-[80px] font-mono text-sm"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  JWT token for viewer role from 100ms dashboard
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="viewerRoomCode">
                  Viewer Room Code <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="viewerRoomCode"
                  placeholder="e.g., VIEWER_ROOM_001 (auto-generated if empty)"
                  value={viewerRoomCode}
                  onChange={(e) => setViewerRoomCode(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Room code for viewers to join the live stream
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Token Preview */}
          {(authToken || viewerAuthToken) && (
            <div className="space-y-3">
              <Label>Token Preview:</Label>
              
              {authToken && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className="bg-purple-600 text-xs">Broadcaster</Badge>
                  </div>
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {authToken.substring(0, 50)}...
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Length: {authToken.length} chars
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {authToken.startsWith('eyJ') ? 'JWT Format ✓' : 'Custom Format'}
                    </Badge>
                  </div>
                </div>
              )}

              {viewerAuthToken && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-green-600 text-green-600 text-xs">Viewer</Badge>
                  </div>
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {viewerAuthToken.substring(0, 50)}...
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Length: {viewerAuthToken.length} chars
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {viewerAuthToken.startsWith('eyJ') ? 'JWT Format ✓' : 'Custom Format'}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !authToken.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? 'Saving...' : 'Save Auth Token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
