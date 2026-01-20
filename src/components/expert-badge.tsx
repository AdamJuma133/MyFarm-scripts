import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Award, Star, Shield, Crown, Sparkles } from 'lucide-react';

interface ExpertBadgeProps {
  reputationScore: number;
  acceptedAnswers: number;
  totalReplies: number;
  showDetails?: boolean;
}

export type BadgeLevel = 'newcomer' | 'contributor' | 'helper' | 'expert' | 'master';

export function getBadgeLevel(reputationScore: number): BadgeLevel {
  if (reputationScore >= 100) return 'master';
  if (reputationScore >= 50) return 'expert';
  if (reputationScore >= 20) return 'helper';
  if (reputationScore >= 5) return 'contributor';
  return 'newcomer';
}

export function getBadgeInfo(level: BadgeLevel) {
  switch (level) {
    case 'master':
      return {
        label: 'Master Farmer',
        icon: Crown,
        color: 'bg-yellow-500 text-yellow-950',
        description: 'Top contributor with exceptional expertise',
        privileges: 'Can pin posts & moderate content',
      };
    case 'expert':
      return {
        label: 'Expert',
        icon: Shield,
        color: 'bg-purple-500 text-purple-950',
        description: 'Highly knowledgeable community member',
        privileges: 'Can pin posts to help others',
      };
    case 'helper':
      return {
        label: 'Helper',
        icon: Star,
        color: 'bg-primary text-primary-foreground',
        description: 'Active helper in the community',
        privileges: '30 more points to unlock pin posts',
      };
    case 'contributor':
      return {
        label: 'Contributor',
        icon: Sparkles,
        color: 'bg-blue-500 text-blue-950',
        description: 'Regular community contributor',
        privileges: '45 more points to unlock pin posts',
      };
    default:
      return {
        label: 'Newcomer',
        icon: Award,
        color: 'bg-muted text-muted-foreground',
        description: 'New to the community',
        privileges: 'Keep helping to earn privileges!',
      };
  }
}

export function ExpertBadge({ 
  reputationScore, 
  acceptedAnswers, 
  totalReplies,
  showDetails = false 
}: ExpertBadgeProps) {
  const { t } = useTranslation();
  const level = getBadgeLevel(reputationScore);
  const info = getBadgeInfo(level);
  const Icon = info.icon;

  if (level === 'newcomer' && !showDetails) {
    return null;
  }

  const badge = (
    <Badge className={`${info.color} gap-1`}>
      <Icon className="h-3 w-3" />
      {info.label}
    </Badge>
  );

  if (showDetails) {
    return (
      <div className="flex flex-col gap-2">
        {badge}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{t('badges.reputation', 'Reputation')}: {reputationScore}</p>
          <p>{t('badges.acceptedAnswers', 'Accepted answers')}: {acceptedAnswers}</p>
          <p>{t('badges.totalReplies', 'Total replies')}: {totalReplies}</p>
        </div>
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <p className="font-medium">{info.label}</p>
          <p className="text-muted-foreground">{info.description}</p>
          <p className="text-xs mt-1">
            {reputationScore} {t('badges.points', 'points')} • {acceptedAnswers} {t('badges.accepted', 'accepted')}
          </p>
          <p className="text-xs text-primary mt-1">{info.privileges}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
