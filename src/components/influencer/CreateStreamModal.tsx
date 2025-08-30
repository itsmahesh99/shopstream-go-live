import React, { useState } from 'react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useLiveSessions } from '../../hooks/useLiveStream';
import { useToast } from '../../hooks/use-toast';

interface CreateStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateStreamModal: React.FC<CreateStreamModalProps> = ({ isOpen, onClose }) => {
  const { createSession } = useLiveSessions();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '',
    product_ids: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      const result = await createSession({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        scheduled_start_time,
        product_ids: formData.product_ids.length > 0 ? formData.product_ids : undefined
      });

      if (result.error) {
        toast({
          title: 'Error Creating Stream',
          description: result.error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Stream Created Successfully',
          description: 'Your live stream has been scheduled',
        });
        setFormData({
          title: '',
          description: '',
          scheduled_date: '',
          scheduled_time: '',
          product_ids: []
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create stream',
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
      // If today is selected, minimum time is current time + 1 hour
      const minTime = new Date(now.getTime() + 60 * 60 * 1000);
      const hours = String(minTime.getHours()).padStart(2, '0');
      const minutes = String(minTime.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return '00:00';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Create New Live Stream</CardTitle>
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
              />
            </div>

            {/* Scheduling */}
            <div className="space-y-3">
              <Label className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Stream (Optional)
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
                Leave empty to create an unscheduled stream that you can start anytime
              </p>
            </div>

            {/* Stream Type Options */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Stream Features
              </h4>
              <div className="text-sm text-purple-700 space-y-1">
                <p>• Product showcase and sales integration</p>
                <p>• Real-time viewer interaction</p>
                <p>• Automatic recording (optional)</p>
                <p>• Performance analytics</p>
              </div>
            </div>

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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Stream'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
