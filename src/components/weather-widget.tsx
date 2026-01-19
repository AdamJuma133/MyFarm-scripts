import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets,
  Thermometer,
  AlertTriangle,
  MapPin
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  precipitation: number;
  daily: {
    date: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
  }[];
}

interface FarmingRecommendation {
  type: 'success' | 'warning' | 'info';
  message: string;
}

const getWeatherIcon = (code: number, className = "h-6 w-6") => {
  if (code === 0) return <Sun className={`${className} text-warning`} />;
  if (code >= 1 && code <= 3) return <Cloud className={`${className} text-muted-foreground`} />;
  if (code >= 45 && code <= 48) return <Cloud className={`${className} text-muted-foreground`} />;
  if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-primary`} />;
  if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-blue-400`} />;
  if (code >= 80 && code <= 99) return <CloudRain className={`${className} text-destructive`} />;
  return <Sun className={`${className} text-warning`} />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 66 && code <= 67) return 'Freezing rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const getFarmingRecommendations = (weather: WeatherData): FarmingRecommendation[] => {
  const recommendations: FarmingRecommendation[] = [];

  // Temperature-based recommendations
  if (weather.temperature > 35) {
    recommendations.push({
      type: 'warning',
      message: 'High heat stress risk. Water crops early morning or late evening.'
    });
  } else if (weather.temperature < 5) {
    recommendations.push({
      type: 'warning',
      message: 'Frost risk. Protect sensitive crops with covers or mulching.'
    });
  }

  // Humidity-based recommendations
  if (weather.humidity > 80) {
    recommendations.push({
      type: 'warning',
      message: 'High humidity increases fungal disease risk. Monitor crops closely.'
    });
  } else if (weather.humidity < 30) {
    recommendations.push({
      type: 'info',
      message: 'Low humidity. Increase irrigation frequency if needed.'
    });
  }

  // Rain-based recommendations
  if (weather.precipitation > 10) {
    recommendations.push({
      type: 'info',
      message: 'Heavy rain expected. Delay fertilizer application.'
    });
  } else if (weather.precipitation === 0 && weather.weatherCode === 0) {
    recommendations.push({
      type: 'success',
      message: 'Good weather for spraying or harvesting activities.'
    });
  }

  // Wind-based recommendations
  if (weather.windSpeed > 20) {
    recommendations.push({
      type: 'warning',
      message: 'High winds. Avoid spraying pesticides today.'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      message: 'Weather conditions are favorable for farming activities.'
    });
  }

  return recommendations.slice(0, 3);
};

export function WeatherWidget() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's location
      let lat = -1.2921; // Default to Nairobi, Kenya
      let lon = 36.8219;

      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch {
          console.log('Using default location');
        }
      }

      // Fetch weather from Open-Meteo (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
      );

      if (!response.ok) throw new Error('Failed to fetch weather');

      const data = await response.json();

      // Get location name via reverse geocoding
      try {
        const geoResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`
        );
        const geoData = await geoResponse.json();
        setLocation(geoData.timezone?.split('/').pop()?.replace('_', ' ') || 'Your Location');
      } catch {
        setLocation('Your Location');
      }

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        precipitation: data.current.precipitation || 0,
        daily: data.daily.time.map((date: string, i: number) => ({
          date,
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          weatherCode: data.daily.weather_code[i],
        })),
      });
    } catch (err) {
      setError('Unable to load weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cloud className="h-5 w-5" />
            {t('weather.title', 'Weather Forecast')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cloud className="h-5 w-5" />
            {t('weather.title', 'Weather Forecast')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>{error || t('weather.error', 'Unable to load weather')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recommendations = getFarmingRecommendations(weather);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Cloud className="h-5 w-5" />
            {t('weather.title', 'Weather Forecast')}
          </span>
          <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {location}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.weatherCode, "h-10 w-10")}
            <div>
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground">
                {getWeatherDescription(weather.weatherCode)}
              </p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Droplets className="h-4 w-4" />
              {weather.humidity}%
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="h-4 w-4" />
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {weather.daily.slice(1, 5).map((day) => (
            <div
              key={day.date}
              className="flex-1 min-w-[60px] text-center p-2 rounded-lg bg-muted/30"
            >
              <p className="text-xs text-muted-foreground">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </p>
              <div className="my-1 flex justify-center">
                {getWeatherIcon(day.weatherCode, "h-5 w-5")}
              </div>
              <p className="text-xs font-medium">
                {day.tempMax}° / {day.tempMin}°
              </p>
            </div>
          ))}
        </div>

        {/* Farming Recommendations */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            {t('weather.farmingTips', 'Farming Recommendations')}
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <Badge
                key={i}
                variant={rec.type === 'warning' ? 'destructive' : rec.type === 'success' ? 'default' : 'secondary'}
                className="w-full justify-start py-2 text-xs font-normal whitespace-normal h-auto"
              >
                {rec.message}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
