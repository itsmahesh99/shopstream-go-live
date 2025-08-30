import React from 'react';
import { useInfluencerGoals } from '@/hooks/useInfluencer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Target, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

const GoalsTracker = () => {
  const { goals, loading } = useInfluencerGoals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4" />;
      case 'paused':
        return <Clock className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals & Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals & Targets
            {goals.length > 0 && (
              <Badge variant="secondary">{goals.length}</Badge>
            )}
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
            <p className="text-gray-600 mb-4">
              Set goals to track your progress and stay motivated!
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.current_value, goal.target_value);
              const isCompleted = goal.status === 'completed';
              
              return (
                <div 
                  key={goal.id} 
                  className="space-y-3 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <Badge 
                        className={getStatusColor(goal.status)}
                        variant="outline"
                      >
                        {getStatusIcon(goal.status)}
                        <span className="ml-1 capitalize">{goal.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round(progress)}% complete
                      </p>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  )}

                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Started: {new Date(goal.created_at).toLocaleDateString()}
                      </span>
                      {goal.target_date && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {isCompleted && goal.completion_date && (
                    <div className="flex items-center space-x-2 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        Completed on {new Date(goal.completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsTracker;
