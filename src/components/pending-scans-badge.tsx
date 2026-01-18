import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PendingScansBadgeProps {
  count: number;
  className?: string;
}

export function PendingScansBadge({ count, className }: PendingScansBadgeProps) {
  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs font-bold animate-pulse",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}