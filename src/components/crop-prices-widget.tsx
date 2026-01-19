import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CropPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

// Simulated market data - in production, this would come from an API
const MARKET_DATA: Record<string, { basePrice: number; volatility: number; unit: string }> = {
  'Tomato': { basePrice: 2.50, volatility: 0.3, unit: 'kg' },
  'Corn': { basePrice: 180, volatility: 0.1, unit: 'ton' },
  'Rice': { basePrice: 420, volatility: 0.15, unit: 'ton' },
  'Wheat': { basePrice: 280, volatility: 0.12, unit: 'ton' },
  'Potato': { basePrice: 1.20, volatility: 0.25, unit: 'kg' },
  'Pepper': { basePrice: 3.80, volatility: 0.35, unit: 'kg' },
  'Cucumber': { basePrice: 1.80, volatility: 0.28, unit: 'kg' },
  'Cassava': { basePrice: 150, volatility: 0.08, unit: 'ton' },
  'Banana': { basePrice: 1.50, volatility: 0.2, unit: 'kg' },
  'Coffee': { basePrice: 4200, volatility: 0.18, unit: 'ton' },
  'Mango': { basePrice: 2.20, volatility: 0.4, unit: 'kg' },
  'Soybean': { basePrice: 450, volatility: 0.14, unit: 'ton' },
};

const DEFAULT_CROPS = ['Tomato', 'Corn', 'Rice', 'Coffee'];

export function CropPricesWidget() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [prices, setPrices] = useState<CropPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCrops, setUserCrops] = useState<string[]>([]);

  useEffect(() => {
    fetchUserCrops();
  }, [user]);

  useEffect(() => {
    if (userCrops.length >= 0) {
      generatePrices();
    }
  }, [userCrops]);

  const fetchUserCrops = async () => {
    if (!user) {
      setUserCrops([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('primary_crops')
        .eq('user_id', user.id)
        .single();

      if (!error && data?.primary_crops) {
        setUserCrops(data.primary_crops);
      } else {
        setUserCrops([]);
      }
    } catch {
      setUserCrops([]);
    }
  };

  const generatePrices = () => {
    setLoading(true);
    
    // Use user's crops or default crops
    const cropsToShow = userCrops.length > 0 ? userCrops : DEFAULT_CROPS;
    
    const generatedPrices: CropPrice[] = cropsToShow
      .filter(crop => MARKET_DATA[crop])
      .slice(0, 4)
      .map(crop => {
        const data = MARKET_DATA[crop];
        const randomChange = (Math.random() - 0.5) * 2 * data.volatility * 100;
        const changePercent = Math.round(randomChange * 10) / 10;
        const priceVariation = 1 + (Math.random() - 0.5) * 0.1;
        const currentPrice = Math.round(data.basePrice * priceVariation * 100) / 100;

        return {
          crop,
          price: currentPrice,
          unit: data.unit,
          change: changePercent,
          trend: changePercent > 0.5 ? 'up' : changePercent < -0.5 ? 'down' : 'stable',
        };
      });

    // If user has no matching crops, show defaults
    if (generatedPrices.length === 0) {
      DEFAULT_CROPS.forEach(crop => {
        const data = MARKET_DATA[crop];
        if (data) {
          const randomChange = (Math.random() - 0.5) * 2 * data.volatility * 100;
          const changePercent = Math.round(randomChange * 10) / 10;
          const priceVariation = 1 + (Math.random() - 0.5) * 0.1;
          const currentPrice = Math.round(data.basePrice * priceVariation * 100) / 100;

          generatedPrices.push({
            crop,
            price: currentPrice,
            unit: data.unit,
            change: changePercent,
            trend: changePercent > 0.5 ? 'up' : changePercent < -0.5 ? 'down' : 'stable',
          });
        }
      });
    }

    setPrices(generatedPrices);
    setLoading(false);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            {t('prices.title', 'Market Prices')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            {t('prices.title', 'Market Prices')}
          </span>
          <Button variant="ghost" size="icon" onClick={generatePrices} className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {prices.map((item) => (
          <div
            key={item.crop}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{item.crop}</span>
              {userCrops.includes(item.crop) && (
                <Badge variant="outline" className="text-xs">
                  {t('prices.yourCrop', 'Your crop')}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-sm">
                  ${item.price.toLocaleString()}/{item.unit}
                </p>
                <p className={`text-xs flex items-center gap-1 justify-end ${getTrendColor(item.trend)}`}>
                  {getTrendIcon(item.trend)}
                  {item.change > 0 ? '+' : ''}{item.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-2">
          {t('prices.disclaimer', 'Simulated prices for demonstration')}
        </p>
      </CardContent>
    </Card>
  );
}
