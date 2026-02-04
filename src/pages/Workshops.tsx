import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
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
    title: 'Video Title 1',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Diseases',
    views: '0'
  },
  {
    id: '2',
    title: 'Video Title 2',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Planting',
    views: '0'
  },
  {
    id: '3',
    title: 'Video Title 3',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Soil',
    views: '0'
  },
  {
    id: '4',
    title: 'Video Title 4',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Irrigation',
    views: '0'
  },
  {
    id: '5',
    title: 'Video Title 5',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Climate-Smart',
    views: '0'
  },
  {
    id: '6',
    title: 'Video Title 6',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Pest Management',
    views: '0'
  },
  {
    id: '7',
    title: 'Video Title 7',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Organic Certification',
    views: '0'
  },
  {
    id: '8',
    title: 'Video Title 8',
    description: 'Add your video description here.',
    youtubeId: '',
    duration: '00:00',
    category: 'Water Conservation',
    views: '0'
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
  { id: 'all', labelKey: 'workshops.categories.all', icon: BookOpen },
  { id: 'Diseases', labelKey: 'workshops.categories.diseases', icon: Bug },
  { id: 'Planting', labelKey: 'workshops.categories.planting', icon: Sprout },
  { id: 'Soil', labelKey: 'workshops.categories.soil', icon: Sun },
  { id: 'Irrigation', labelKey: 'workshops.categories.irrigation', icon: Droplets },
  { id: 'Climate-Smart', labelKey: 'workshops.categories.climateSmart', icon: Sun },
  { id: 'Pest Management', labelKey: 'workshops.categories.pestManagement', icon: Bug },
  { id: 'Organic Certification', labelKey: 'workshops.categories.organicCertification', icon: Sprout },
  { id: 'Water Conservation', labelKey: 'workshops.categories.waterConservation', icon: Droplets }
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
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>
      
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8 flex-1">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-1 md:mb-2">
            <BackButton />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 md:gap-3">
              <Video className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              {t('workshops.title', 'Learning Hub')}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base ml-10">
            {t('workshops.subtitle', 'Video tutorials and live workshops to improve your farming skills')}
          </p>
        </div>

        <Tabs defaultValue="videos" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md touch-manipulation">
            <TabsTrigger value="videos" className="flex items-center gap-2 min-h-[44px]">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">{t('workshops.videoLibrary', 'Video Library')}</span>
              <span className="sm:hidden">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2 min-h-[44px]">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{t('workshops.upcomingEvents', 'Upcoming Events')}</span>
              <span className="sm:hidden">Events</span>
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
            <div className="flex gap-2 flex-wrap overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0 mobile-scroll">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="flex items-center gap-2 shrink-0 min-h-[44px] touch-manipulation"
                  >
                    <Icon className="h-4 w-4" />
                    {t(cat.labelKey)}
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
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
}
