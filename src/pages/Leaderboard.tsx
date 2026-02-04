import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star,
  MessageCircle,
  CheckCircle,
  Crown
} from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { ExpertBadge } from '@/components/expert-badge';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardUser {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  reputation_score: number;
  accepted_answers: number;
  total_replies: number;
  farm_name: string | null;
}

const Leaderboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'reputation' | 'accepted' | 'replies'>('reputation');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, reputation_score, accepted_answers, total_replies, farm_name')
        .gt('reputation_score', 0)
        .order('reputation_score', { ascending: false })
        .limit(50);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case 'accepted':
          return b.accepted_answers - a.accepted_answers;
        case 'replies':
          return b.total_replies - a.total_replies;
        default:
          return b.reputation_score - a.reputation_score;
      }
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{rank}</span>;
    }
  };

  const sortedUsers = getSortedUsers();

  return (
    <div className="min-h-screen bg-gradient-secondary pb-20 md:pb-0">
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton fallbackPath="/forum" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Trophy className="h-7 w-7 text-primary" />
              {t('leaderboard.title', 'Leaderboard')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('leaderboard.subtitle', 'Top community contributors')}
            </p>
          </div>
        </div>

        {/* Top 3 Podium */}
        {!loading && sortedUsers.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {/* 2nd Place */}
            <Card className="pt-4 text-center order-1">
              <CardContent className="p-3">
                <div className="flex justify-center mb-2">
                  <Medal className="h-8 w-8 text-gray-400" />
                </div>
                <Avatar className="h-12 w-12 mx-auto mb-2 ring-2 ring-gray-400">
                  <AvatarImage src={sortedUsers[1]?.avatar_url || undefined} />
                  <AvatarFallback>{sortedUsers[1]?.full_name?.charAt(0) || '2'}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-sm truncate">{sortedUsers[1]?.full_name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">{sortedUsers[1]?.reputation_score} pts</p>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="pt-4 text-center order-2 border-primary bg-primary/5 -mt-2">
              <CardContent className="p-3">
                <div className="flex justify-center mb-2">
                  <Crown className="h-10 w-10 text-yellow-500" />
                </div>
                <Avatar className="h-14 w-14 mx-auto mb-2 ring-2 ring-yellow-500">
                  <AvatarImage src={sortedUsers[0]?.avatar_url || undefined} />
                  <AvatarFallback>{sortedUsers[0]?.full_name?.charAt(0) || '1'}</AvatarFallback>
                </Avatar>
                <p className="font-bold text-sm truncate">{sortedUsers[0]?.full_name || 'Anonymous'}</p>
                <p className="text-xs text-primary font-medium">{sortedUsers[0]?.reputation_score} pts</p>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="pt-4 text-center order-3">
              <CardContent className="p-3">
                <div className="flex justify-center mb-2">
                  <Medal className="h-8 w-8 text-amber-600" />
                </div>
                <Avatar className="h-12 w-12 mx-auto mb-2 ring-2 ring-amber-600">
                  <AvatarImage src={sortedUsers[2]?.avatar_url || undefined} />
                  <AvatarFallback>{sortedUsers[2]?.full_name?.charAt(0) || '3'}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-sm truncate">{sortedUsers[2]?.full_name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">{sortedUsers[2]?.reputation_score} pts</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sort Tabs */}
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reputation" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {t('leaderboard.reputation', 'Reputation')}
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {t('leaderboard.accepted', 'Accepted')}
            </TabsTrigger>
            <TabsTrigger value="replies" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {t('leaderboard.replies', 'Replies')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Full Leaderboard */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {t('leaderboard.empty', 'No contributors yet. Be the first to help others!')}
              </p>
              <Button className="mt-4" onClick={() => navigate('/forum')}>
                {t('leaderboard.goToForum', 'Go to Forum')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sortedUsers.map((user, index) => (
              <Card key={user.user_id} className={index < 3 ? 'border-primary/30' : ''}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-8 flex justify-center">
                    {getRankIcon(index + 1)}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{user.full_name || 'Anonymous'}</span>
                      <ExpertBadge
                        reputationScore={user.reputation_score}
                        acceptedAnswers={user.accepted_answers}
                        totalReplies={user.total_replies}
                      />
                    </div>
                    {user.farm_name && (
                      <p className="text-xs text-muted-foreground truncate">{user.farm_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="h-4 w-4 text-primary" />
                      {user.reputation_score}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <CheckCircle className="h-3 w-3" />
                        {user.accepted_answers}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MessageCircle className="h-3 w-3" />
                        {user.total_replies}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Leaderboard;
