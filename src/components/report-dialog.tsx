import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Flag, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: 'post' | 'reply';
  targetId: string;
  targetTitle?: string;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'harassment', label: 'Harassment or abuse' },
  { value: 'misinformation', label: 'Misinformation or harmful advice' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'other', label: 'Other' },
];

export function ReportDialog({ open, onOpenChange, targetType, targetId, targetTitle }: ReportDialogProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !reason) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reports').insert({
        reporter_id: user.id,
        target_type: targetType,
        target_id: targetId,
        reason,
        details: details.trim() || null,
      });

      if (error) throw error;

      toast.success(t('report.submitted', 'Report submitted. Thank you for helping keep our community safe.'));
      onOpenChange(false);
      setReason('');
      setDetails('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(t('report.error', 'Failed to submit report'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            {t('report.title', 'Report Content')}
          </DialogTitle>
          <DialogDescription>
            {targetTitle 
              ? t('report.descriptionWithTitle', 'Report: "{{title}}"', { title: targetTitle.substring(0, 50) + (targetTitle.length > 50 ? '...' : '') })
              : t('report.description', 'Help us understand what\'s wrong with this content.')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-base">{t('report.reason', 'Why are you reporting this?')}</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2 space-y-2">
              {REPORT_REASONS.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="font-normal cursor-pointer">
                    {t(`report.reasons.${r.value}`, r.label)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="details">{t('report.details', 'Additional details (optional)')}</Label>
            <Textarea
              id="details"
              placeholder={t('report.detailsPlaceholder', 'Provide more context about this report...')}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reason || submitting}
              variant="destructive"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t('report.submit', 'Submit Report')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
