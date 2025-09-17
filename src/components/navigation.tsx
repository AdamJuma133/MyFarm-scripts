import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scan, Book, Sprout } from 'lucide-react';

interface NavigationProps {
  activeTab: 'analyzer' | 'library';
  onTabChange: (tab: 'analyzer' | 'library') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MyFarm
            </h1>
          </div>
          <div className="hidden md:block text-sm text-muted-foreground">
            AI-Powered Crop Disease Identifier
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'analyzer' ? 'default' : 'outline'}
            onClick={() => onTabChange('analyzer')}
            className="flex items-center gap-2"
          >
            <Scan className="h-4 w-4" />
            Disease Analyzer
          </Button>
          <Button
            variant={activeTab === 'library' ? 'default' : 'outline'}
            onClick={() => onTabChange('library')}
            className="flex items-center gap-2"
          >
            <Book className="h-4 w-4" />
            Disease Library
          </Button>
        </div>
      </div>
    </Card>
  );
}