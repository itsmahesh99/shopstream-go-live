import React from 'react';
import { useInfluencerAchievements } from '@/hooks/useInfluencer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Star, 
  Trophy, 
  Award, 
  Target, 
  Calendar,
  TrendingUp
} from 'lucide-react';

const AchievementsDisplay = () => {
  const { achievements, loading } = useInfluencerAchievements();

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 'performance':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'engagement':
        return <Star className="h-5 w-5 text-purple-600" />;
      default:
        return <Award className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBadgeColor = (badgeColor?: string) => {
    switch (badgeColor) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
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
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
          {achievements.length > 0 && (
            <Badge variant="secondary">{achievements.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
            <p className="text-gray-600">
              Start streaming and engaging with your audience to unlock achievements!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getAchievementIcon(achievement.achievement_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    {achievement.target_value && (
                      <p className="text-xs text-gray-500">
                        Target: {achievement.target_value.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {achievement.badge_color && (
                    <Badge 
                      className={getBadgeColor(achievement.badge_color)}
                      variant="outline"
                    >
                      {achievement.badge_color}
                    </Badge>
                  )}
                  <div className="text-right">
                    <p className="text-sm font-medium text-purple-600">
                      +{achievement.points_awarded} pts
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(achievement.earned_at || achievement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsDisplay;
