import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink,
  Play,
  Users,
  BookOpen,
  Sprout,
  Bug,
  Droplets,
  Sun
} from 'lucide-react';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  category: string;
  views: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  host: string;
  type: 'webinar' | 'workshop' | 'qa';
  registrationUrl?: string;
}

const videoTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'How to Identify Tomato Diseases',
    description: 'Learn to recognize common tomato diseases like early blight, late blight, and septoria leaf spot.',
    youtubeId: 'e8dDiLCcBQc',
    duration: '12:34',
    category: 'Disease ID',
    views: '45K'
  },
  {
    id: '2',
    title: 'Organic Pest Control Methods',
    description: 'Natural ways to protect your crops from pests without using harmful chemicals.',
    youtubeId: 'wPqvX3YELrM',
    duration: '18:22',
    category: 'Pest Control',
    views: '32K'
  },
  {
    id: '3',
    title: 'Drip Irrigation Setup Guide',
    description: 'Step-by-step tutorial on setting up efficient drip irrigation for your farm.',
    youtubeId: 'Z8C5MBv8Xyc',
    duration: '15:45',
    category: 'Irrigation',
    views: '28K'
  },
  {
    id: '4',
    title: 'Soil Health and Testing',
    description: 'Understanding your soil composition and how to test for nutrients.',
    youtubeId: '8tD0OrqQxWA',
    duration: '20:10',
    category: 'Soil',
    views: '22K'
  },
  {
    id: '5',
    title: 'Companion Planting Strategies',
    description: 'Which crops grow well together and how to maximize your garden space.',
    youtubeId: 'Bfmv6T5FzKg',
    duration: '14:55',
    category: 'Planting',
    views: '38K'
  },
  {
    id: '6',
    title: 'Managing Fungal Diseases in Crops',
    description: 'Prevention and treatment strategies for common fungal infections in crops.',
    youtubeId: 'EfOofjqtFbE',
    duration: '16:30',
    category: 'Disease ID',
    views: '41K'
  }
];

const upcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Climate-Smart Agriculture Workshop',
    description: 'Learn techniques to adapt your farming practices to changing climate conditions.',
    date: '2025-01-15',
    time: '14:00 UTC',
    host: 'Dr. Sarah Mitchell',
    type: 'workshop'
  },
  {
    id: '2',
    title: 'Pest Management Q&A Session',
    description: 'Live Q&A with agricultural experts on integrated pest management.',
    date: '2025-01-18',
    time: '16:00 UTC',
    host: 'Agricultural Extension Team',
    type: 'qa'
  },
  {
    id: '3',
    title: 'Organic Certification Webinar',
    description: 'Everything you need to know about getting your farm organically certified.',
    date: '2025-01-22',
    time: '10:00 UTC',
    host: 'Organic Farmers Association',
    type: 'webinar'
  },
  {
    id: '4',
    title: 'Water Conservation Techniques',
    description: 'Practical methods to reduce water usage while maintaining crop yields.',
    date: '2025-01-28',
    time: '15:00 UTC',
    host: 'Water Management Institute',
    type: 'workshop'
  }
];

const categories = [
  { id: 'all', label: 'All', icon: BookOpen },
  { id: 'Disease ID', label: 'Diseases', icon: Bug },
  { id: 'Irrigation', label: 'Irrigation', icon: Droplets },
  { id: 'Planting', label: 'Planting', icon: Sprout },
  { id: 'Soil', label: 'Soil', icon: Sun }
];

export default function Workshops() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);

  const filteredVideos = selectedCategory === 'all' 
    ? videoTutorials 
    : videoTutorials.filter(v => v.category === selectedCategory);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'default';
      case 'webinar': return 'secondary';
      case 'qa': return 'outline';
      default: return 'secondary';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            {t('workshops.title', 'Learning Hub')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('workshops.subtitle', 'Video tutorials and live workshops to improve your farming skills')}
          </p>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {t('workshops.videoLibrary', 'Video Library')}
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('workshops.upcomingEvents', 'Upcoming Events')}
            </TabsTrigger>
          </TabsList>

          {/* Video Library Tab */}
          <TabsContent value="videos" className="space-y-6">
            {/* Video Player */}
            {selectedVideo && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="border-0"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                      <p className="text-muted-foreground mt-1">{selectedVideo.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)}>
                      ✕
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => (
                <Card 
                  key={video.id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-primary-foreground ml-1" />
                      </div>
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/70">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">{video.category}</Badge>
                    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {video.views} views
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="grid gap-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getEventTypeColor(event.type)}>
                            {event.type.toUpperCase()}
                          </Badge>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.host}
                          </span>
                        </div>
                      </div>
                      
                      <Button className="shrink-0">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t('workshops.register', 'Register')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  {t('workshops.wantToHost', 'Want to host a workshop?')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('workshops.hostDescription', 'Share your agricultural expertise with farmers around the world.')}
                </p>
                <Button variant="outline">
                  {t('workshops.contactUs', 'Contact Us')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
