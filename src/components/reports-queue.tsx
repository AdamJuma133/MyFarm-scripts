import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  details: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  resolution_note: string | null;
  created_at: string;
  reporter?: {
    full_name: string | null;
  };
  target_content?: string;
}

export function ReportsQueue() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch reporter profiles and target content
      const reportsWithDetails = await Promise.all(
        (data || []).map(async (report) => {
          const { data: reporter } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', report.reporter_id)
            .single();

          // Fetch target content
          let targetContent = '';
          if (report.target_type === 'post') {
            const { data: post } = await supabase
              .from('forum_posts')
              .select('title, content')
              .eq('id', report.target_id)
              .single();
            targetContent = post ? `${post.title}: ${post.content.substring(0, 100)}...` : '[Deleted]';
          } else if (report.target_type === 'reply') {
            const { data: reply } = await supabase
              .from('forum_replies')
              .select('content')
              .eq('id', report.target_id)
              .single();
            targetContent = reply ? reply.content.substring(0, 100) + '...' : '[Deleted]';
          }

          return { ...report, reporter, target_content: targetContent };
        })
      );

      setReports(reportsWithDetails);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string, action: 'resolve' | 'dismiss') => {
    if (!user) return;

    setProcessing(reportId);
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: action === 'resolve' ? 'resolved' : 'dismissed',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          resolution_note: resolutionNote || null,
        })
        .eq('id', reportId);

      if (error) throw error;

      // Log the moderation action
      await supabase.from('moderation_logs').insert({
        moderator_id: user.id,
        action_type: action === 'resolve' ? 'resolve_report' : 'dismiss_report',
        target_type: 'report',
        target_id: reportId,
        reason: resolutionNote || null,
      });

      toast.success(
        action === 'resolve'
          ? t('moderation.reportResolved', 'Report resolved')
          : t('moderation.reportDismissed', 'Report dismissed')
      );

      setResolutionNote('');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error(t('moderation.error', 'Failed to update report'));
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="outline" className="text-gray-600 border-gray-600"><XCircle className="h-3 w-3 mr-1" />Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            {t('moderation.reportsTitle', 'Reports Queue')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
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
          <Flag className="h-5 w-5" />
          {t('moderation.reportsTitle', 'Reports Queue')}
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {t('moderation.noReports', 'No reports to review')}
          </p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className={`p-4 rounded-lg border ${report.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' : 'bg-muted/50'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {report.target_type === 'post' ? (
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium capitalize">{report.target_type}</span>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {report.target_content}
                  </p>

                  <div className="text-xs text-muted-foreground mb-2">
                    <span className="font-medium">{t('report.reason', 'Reason')}:</span> {report.reason}
                    {report.details && (
                      <p className="mt-1">{report.details}</p>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    {t('moderation.reportedBy', 'Reported by')}: {report.reporter?.full_name || 'Unknown'} • {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </div>

                  {report.status === 'pending' && (
                    <div className="space-y-2">
                      {selectedReport === report.id && (
                        <Textarea
                          placeholder={t('moderation.resolutionNote', 'Add a resolution note (optional)...')}
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          className="text-sm"
                        />
                      )}
                      <div className="flex gap-2">
                        {selectedReport !== report.id ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReport(report.id)}
                          >
                            {t('moderation.review', 'Review')}
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleResolve(report.id, 'resolve')}
                              disabled={processing === report.id}
                            >
                              {processing === report.id && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                              {t('moderation.takeAction', 'Take Action')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolve(report.id, 'dismiss')}
                              disabled={processing === report.id}
                            >
                              {t('moderation.dismiss', 'Dismiss')}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedReport(null);
                                setResolutionNote('');
                              }}
                            >
                              {t('common.cancel', 'Cancel')}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {report.resolution_note && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {t('moderation.note', 'Note')}: {report.resolution_note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
