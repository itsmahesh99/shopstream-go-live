import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Video,
  Save,
  X
} from 'lucide-react';

const InfluencerSchedule = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingStream, setEditingStream] = useState<number | null>(null);
  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    category: 'fashion'
  });

  // Mock scheduled streams data
  const [scheduledStreams, setScheduledStreams] = useState([
    {
      id: 1,
      title: 'Holiday Fashion Haul',
      description: 'Showcasing the latest holiday fashion trends and styling tips for the festive season.',
      date: '2024-12-25',
      time: '19:00',
      duration: 90,
      category: 'Fashion',
      status: 'scheduled',
      expectedViewers: 250,
      products: 8,
      isRecurring: false
    },
    {
      id: 2,
      title: 'Tech Product Reviews',
      description: 'Reviewing the latest gadgets and tech accessories for the new year.',
      date: '2024-12-28',
      time: '20:00',
      duration: 120,
      category: 'Technology',
      status: 'scheduled',
      expectedViewers: 180,
      products: 5,
      isRecurring: false
    },
    {
      id: 3,
      title: 'New Year Skincare Routine',
      description: 'Start the new year with a fresh skincare routine. Product demos and tips.',
      date: '2025-01-02',
      time: '18:30',
      duration: 75,
      category: 'Beauty',
      status: 'draft',
      expectedViewers: 200,
      products: 6,
      isRecurring: false
    },
    {
      id: 4,
      title: 'Weekly Q&A Session',
      description: 'Answer your questions about fashion, lifestyle, and product recommendations.',
      date: '2025-01-05',
      time: '19:00',
      duration: 60,
      category: 'Lifestyle',
      status: 'scheduled',
      expectedViewers: 150,
      products: 3,
      isRecurring: true
    }
  ]);

  const categories = [
    'Fashion', 'Beauty', 'Technology', 'Lifestyle', 'Home & Decor', 'Fitness', 'Food', 'Other'
  ];

  const handleCreateStream = () => {
    if (newStream.title && newStream.date && newStream.time) {
      const stream = {
        id: Date.now(),
        title: newStream.title,
        description: newStream.description,
        date: newStream.date,
        time: newStream.time,
        duration: parseInt(newStream.duration),
        category: newStream.category,
        status: 'draft',
        expectedViewers: Math.floor(Math.random() * 200) + 100,
        products: 0,
        isRecurring: false
      };
      
      setScheduledStreams([...scheduledStreams, stream]);
      setNewStream({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: '60',
        category: 'fashion'
      });
      setIsCreating(false);
    }
  };

  const handleDeleteStream = (id: number) => {
    setScheduledStreams(scheduledStreams.filter(stream => stream.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'live':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-2">
            Plan and manage your upcoming live streams
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Stream
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{scheduledStreams.filter(s => s.status === 'scheduled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold">{scheduledStreams.filter(s => s.status === 'draft').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Expected Viewers</p>
                <p className="text-2xl font-bold">
                  {scheduledStreams.reduce((sum, stream) => sum + stream.expectedViewers, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">
                  {Math.round(scheduledStreams.reduce((sum, stream) => sum + stream.duration, 0) / 60)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Stream Modal */}
      {isCreating && (
        <Card className="mb-8 border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-purple-800">Schedule New Stream</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Stream Title *</Label>
                  <Input
                    id="title"
                    value={newStream.title}
                    onChange={(e) => setNewStream({...newStream, title: e.target.value})}
                    placeholder="Enter an engaging title"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newStream.description}
                    onChange={(e) => setNewStream({...newStream, description: e.target.value})}
                    placeholder="Describe what you'll be covering in this stream"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newStream.category}
                    onChange={(e) => setNewStream({...newStream, category: e.target.value})}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newStream.date}
                    onChange={(e) => setNewStream({...newStream, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newStream.time}
                    onChange={(e) => setNewStream({...newStream, time: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newStream.duration}
                    onChange={(e) => setNewStream({...newStream, duration: e.target.value})}
                    min="15"
                    max="300"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStream} className="bg-purple-500 hover:bg-purple-600">
                <Save className="mr-2 h-4 w-4" />
                Schedule Stream
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Streams List */}
      <div className="space-y-4">
        {scheduledStreams.map((stream) => (
          <Card key={stream.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{stream.title}</h3>
                    <Badge className={getStatusColor(stream.status)}>
                      {stream.status.charAt(0).toUpperCase() + stream.status.slice(1)}
                    </Badge>
                    {stream.isRecurring && (
                      <Badge variant="outline">Recurring</Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{stream.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(stream.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{formatTime(stream.time)} ({stream.duration}min)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{stream.expectedViewers} expected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{stream.category}</Badge>
                      <span>{stream.products} products</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteStream(stream.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scheduledStreams.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No streams scheduled</h3>
            <p className="text-gray-600 mb-4">Start by scheduling your first live stream</p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Schedule Your First Stream
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfluencerSchedule;
