import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useLiveSessions } from '../../hooks/useLiveStream';
import { useToast } from '../../hooks/use-toast';
import { LiveSession } from '../../types/liveStream';
import { format } from 'date-fns';

interface EditStreamModalProps {
  session: LiveSession;
  isOpen: boolean;
  onClose: () => void;
}

export const EditStreamModal: React.FC<EditStreamModalProps> = ({ session, isOpen, onClose }) => {
  const { updateSession } = useLiveSessions();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '',
    status: 'scheduled' as 'scheduled' | 'live' | 'ended' | 'cancelled'
  });

  useEffect(() => {
    if (session) {
      const scheduledTime = session.scheduled_start_time ? new Date(session.scheduled_start_time) : null;
      
      setFormData({
        title: session.title,
        description: session.description || '',
        scheduled_date: scheduledTime ? format(scheduledTime, 'yyyy-MM-dd') : '',
        scheduled_time: scheduledTime ? format(scheduledTime, 'HH:mm') : '',
        status: session.status
      });
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({ ...prev, status: status as typeof prev.status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a stream title',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      let scheduled_start_time: string | undefined;
      
      if (formData.scheduled_date && formData.scheduled_time) {
        scheduled_start_time = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString();
      }

      const updates = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        scheduled_start_time,
        status: formData.status
      };

      const result = await updateSession(session.id, updates);

      if (result.error) {
        toast({
          title: 'Error Updating Stream',
          description: result.error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Stream Updated Successfully',
          description: 'Your changes have been saved',
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update stream',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMinTime = () => {
    const now = new Date();
    const selectedDate = formData.scheduled_date;
    
    if (selectedDate === getMinDateTime()) {
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return '00:00';
  };

  const canEditStatus = () => {
    // Can only change status in certain circumstances
    return session.status === 'scheduled' || session.status === 'cancelled';
  };

  const getStatusOptions = () => {
    const options = [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'cancelled', label: 'Cancelled' }
    ];

    // If stream is already live or ended, include those options
    if (session.status === 'live') {
      options.push({ value: 'live', label: 'Live' });
      options.push({ value: 'ended', label: 'End Stream' });
    }
    
    if (session.status === 'ended') {
      options.push({ value: 'ended', label: 'Ended' });
    }

    return options;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Edit Live Stream</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stream Title */}
            <div>
              <Label htmlFor="title">Stream Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Fashion Haul & Styling Tips"
                className="mt-1"
                required
                disabled={session.status === 'live' || session.status === 'ended'}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell your audience what to expect in this stream..."
                className="mt-1"
                rows={3}
                disabled={session.status === 'live' || session.status === 'ended'}
              />
            </div>

            {/* Status */}
            {canEditStatus() && (
              <div>
                <Label>Stream Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Scheduling - only if not live or ended */}
            {session.status !== 'live' && session.status !== 'ended' && (
              <div className="space-y-3">
                <Label className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Stream
                </Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="scheduled_date" className="text-sm">Date</Label>
                    <Input
                      id="scheduled_date"
                      name="scheduled_date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={handleInputChange}
                      min={getMinDateTime()}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="scheduled_time" className="text-sm">Time</Label>
                    <Input
                      id="scheduled_time"
                      name="scheduled_time"
                      type="time"
                      value={formData.scheduled_time}
                      onChange={handleInputChange}
                      min={getMinTime()}
                      className="mt-1"
                      disabled={!formData.scheduled_date}
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Leave empty for an unscheduled stream
                </p>
              </div>
            )}

            {/* Current Status Info */}
            {(session.status === 'live' || session.status === 'ended') && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Stream Information</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Status: <span className="font-medium">{session.status.toUpperCase()}</span></p>
                  {session.actual_start_time && (
                    <p>Started: {format(new Date(session.actual_start_time), 'MMM dd, yyyy HH:mm')}</p>
                  )}
                  {session.end_time && (
                    <p>Ended: {format(new Date(session.end_time), 'MMM dd, yyyy HH:mm')}</p>
                  )}
                  {session.duration_minutes && (
                    <p>Duration: {session.duration_minutes} minutes</p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={loading || (session.status === 'live' && formData.status === 'live')}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
