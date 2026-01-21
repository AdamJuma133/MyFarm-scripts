import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pin, 
  Trash2, 
  Shield, 
  UserCheck,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ModerationLog {
  id: string;
  moderator_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  target_user_id: string | null;
  reason: string | null;
  metadata: unknown;
  created_at: string;
  moderator?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  pin: <Pin className="h-4 w-4" />,
  unpin: <Pin className="h-4 w-4" />,
  delete_post: <Trash2 className="h-4 w-4" />,
  delete_reply: <Trash2 className="h-4 w-4" />,
  role_change: <UserCheck className="h-4 w-4" />,
  resolve_report: <Shield className="h-4 w-4" />,
  dismiss_report: <AlertTriangle className="h-4 w-4" />,
};

const ACTION_COLORS: Record<string, string> = {
  pin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  unpin: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  delete_post: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  delete_reply: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  role_change: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  resolve_report: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  dismiss_report: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

export function ModerationLogViewer() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('moderation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch moderator profiles
      const logsWithModerators = await Promise.all(
        (data || []).map(async (log) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('user_id', log.moderator_id)
            .single();
          return { ...log, moderator: profile };
        })
      );

      setLogs(logsWithModerators);
    } catch (error) {
      console.error('Error fetching moderation logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      pin: t('moderation.actions.pin', 'Pinned post'),
      unpin: t('moderation.actions.unpin', 'Unpinned post'),
      delete_post: t('moderation.actions.deletePost', 'Deleted post'),
      delete_reply: t('moderation.actions.deleteReply', 'Deleted reply'),
      role_change: t('moderation.actions.roleChange', 'Changed role'),
      resolve_report: t('moderation.actions.resolveReport', 'Resolved report'),
      dismiss_report: t('moderation.actions.dismissReport', 'Dismissed report'),
    };
    return labels[action] || action;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('moderation.logTitle', 'Moderation Log')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
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
          <Shield className="h-5 w-5" />
          {t('moderation.logTitle', 'Moderation Log')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {t('moderation.noLogs', 'No moderation actions yet')}
          </p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={log.moderator?.avatar_url || undefined} />
                    <AvatarFallback>
                      {log.moderator?.full_name?.charAt(0) || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">
                        {log.moderator?.full_name || t('moderation.unknown', 'Unknown')}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${ACTION_COLORS[log.action_type] || ''}`}
                      >
                        {ACTION_ICONS[log.action_type]}
                        <span className="ml-1">{getActionLabel(log.action_type)}</span>
                      </Badge>
                    </div>
                    {log.reason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('moderation.reason', 'Reason')}: {log.reason}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
