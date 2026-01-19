import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ThumbsUp, 
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  Send,
  Loader2,
  Users,
  TrendingUp
} from 'lucide-react';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { ExpertBadge } from '@/components/expert-badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  crop_type: string | null;
  likes_count: number;
  replies_count: number;
  is_solved: boolean;
  created_at: string;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
    reputation_score?: number;
    accepted_answers?: number;
    total_replies?: number;
  };
}

interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_accepted: boolean;
  likes_count: number;
  created_at: string;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
    reputation_score?: number;
    accepted_answers?: number;
    total_replies?: number;
  };
}

const CATEGORIES = [
  { value: 'general', label: 'General Discussion' },
  { value: 'diseases', label: 'Disease Identification' },
  { value: 'treatment', label: 'Treatment Help' },
  { value: 'prevention', label: 'Prevention Tips' },
  { value: 'success', label: 'Success Stories' },
];

const Forum = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', crop_type: '' });
  const [submittingPost, setSubmittingPost] = useState(false);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
    fetchUserLikes();
  }, [user]);

  useEffect(() => {
    if (selectedPost) {
      fetchReplies(selectedPost.id);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch author info for each post
      const postsWithAuthors = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, reputation_score, accepted_answers, total_replies')
            .eq('user_id', post.user_id)
            .single();
          return { ...post, author: profile };
        })
      );

      setPosts(postsWithAuthors);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const repliesWithAuthors = await Promise.all(
        (data || []).map(async (reply) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, reputation_score, accepted_answers, total_replies')
            .eq('user_id', reply.user_id)
            .single();
          return { ...reply, author: profile };
        })
      );

      setReplies(repliesWithAuthors);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const fetchUserLikes = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('forum_likes')
        .select('post_id, reply_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const likeIds = new Set<string>();
      data?.forEach((like) => {
        if (like.post_id) likeIds.add(`post_${like.post_id}`);
        if (like.reply_id) likeIds.add(`reply_${like.reply_id}`);
      });
      setUserLikes(likeIds);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    setSubmittingPost(true);
    try {
      const { error } = await supabase.from('forum_posts').insert({
        user_id: user.id,
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category,
        crop_type: newPost.crop_type || null,
      });

      if (error) throw error;

      toast.success(t('forum.postCreated', 'Question posted successfully!'));
      setNewPost({ title: '', content: '', category: 'general', crop_type: '' });
      setShowNewPost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(t('forum.postError', 'Failed to post question'));
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleCreateReply = async () => {
    if (!user || !selectedPost || !newReply.trim()) return;

    setSubmittingReply(true);
    try {
      const { error } = await supabase.from('forum_replies').insert({
        post_id: selectedPost.id,
        user_id: user.id,
        content: newReply.trim(),
      });

      if (error) throw error;

      toast.success(t('forum.replyPosted', 'Reply posted!'));
      setNewReply('');
      fetchReplies(selectedPost.id);
      // Update local post replies count
      setSelectedPost({ ...selectedPost, replies_count: selectedPost.replies_count + 1 });
    } catch (error) {
      console.error('Error creating reply:', error);
      toast.error(t('forum.replyError', 'Failed to post reply'));
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    const likeKey = `post_${postId}`;
    const isLiked = userLikes.has(likeKey);

    try {
      if (isLiked) {
        await supabase
          .from('forum_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
        
        userLikes.delete(likeKey);
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count - 1 } : p));
      } else {
        await supabase.from('forum_likes').insert({
          user_id: user.id,
          post_id: postId,
        });
        
        userLikes.add(likeKey);
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
      }
      setUserLikes(new Set(userLikes));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return t('forum.justNow', 'Just now');
    if (diffHours < 24) return t('forum.hoursAgo', '{{count}}h ago', { count: diffHours });
    if (diffDays < 7) return t('forum.daysAgo', '{{count}}d ago', { count: diffDays });
    return date.toLocaleDateString();
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-secondary pb-20 md:pb-0">
        <div className="md:hidden">
          <MobileHeader />
        </div>

        <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-3xl">
          <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>

          <Card className="mb-4">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedPost.author?.avatar_url || undefined} />
                  <AvatarFallback>
                    {selectedPost.author?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{selectedPost.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      {selectedPost.author?.full_name || t('forum.anonymous', 'Anonymous')}
                    </span>
                    {selectedPost.author && (
                      <ExpertBadge
                        reputationScore={selectedPost.author.reputation_score || 0}
                        acceptedAnswers={selectedPost.author.accepted_answers || 0}
                        totalReplies={selectedPost.author.total_replies || 0}
                      />
                    )}
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(selectedPost.created_at)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {CATEGORIES.find(c => c.value === selectedPost.category)?.label || selectedPost.category}
                    </Badge>
                    {selectedPost.is_solved && (
                      <Badge variant="default" className="text-xs bg-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t('forum.solved', 'Solved')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{selectedPost.content}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikePost(selectedPost.id)}
                  className={userLikes.has(`post_${selectedPost.id}`) ? 'text-primary' : ''}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {selectedPost.likes_count}
                </Button>
                <span className="text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4 inline mr-1" />
                  {selectedPost.replies_count} {t('forum.replies', 'replies')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-3 mb-4">
            <h3 className="font-semibold text-lg">
              {t('forum.answers', 'Answers')} ({replies.length})
            </h3>
            {replies.map((reply) => (
              <Card key={reply.id} className={reply.is_accepted ? 'border-success' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.author?.avatar_url || undefined} />
                      <AvatarFallback>
                        {reply.author?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {reply.author?.full_name || t('forum.anonymous', 'Anonymous')}
                        </span>
                        {reply.author && (
                          <ExpertBadge
                            reputationScore={reply.author.reputation_score || 0}
                            acceptedAnswers={reply.author.accepted_answers || 0}
                            totalReplies={reply.author.total_replies || 0}
                          />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(reply.created_at)}
                        </span>
                        {reply.is_accepted && (
                          <Badge variant="default" className="text-xs bg-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('forum.accepted', 'Accepted')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Input */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder={t('forum.writeReply', 'Write your answer...')}
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <Button
                className="mt-2 w-full"
                onClick={handleCreateReply}
                disabled={!newReply.trim() || submittingReply}
              >
                {submittingReply ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {t('forum.postReply', 'Post Answer')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary pb-20 md:pb-0">
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="hidden md:flex mb-6 items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="h-11">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back', 'Back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('forum.title', 'Community Forum')}</h1>
        </div>

        <div className="md:hidden mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            {t('forum.title', 'Community Forum')}
          </h1>
          <p className="text-muted-foreground">
            {t('forum.subtitle', 'Ask questions and share experiences')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-xs text-muted-foreground">{t('forum.questions', 'Questions')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{posts.filter(p => p.is_solved).length}</p>
                <p className="text-xs text-muted-foreground">{t('forum.solved', 'Solved')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('forum.search', 'Search questions...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('forum.ask', 'Ask')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('forum.askQuestion', 'Ask a Question')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('forum.questionTitle', 'Title')}</Label>
                  <Input
                    id="title"
                    placeholder={t('forum.titlePlaceholder', 'What do you need help with?')}
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">{t('forum.category', 'Category')}</Label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="crop">{t('forum.cropType', 'Crop (optional)')}</Label>
                  <Input
                    id="crop"
                    placeholder={t('forum.cropPlaceholder', 'e.g., Tomato, Corn, Rice')}
                    value={newPost.crop_type}
                    onChange={(e) => setNewPost({ ...newPost, crop_type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="content">{t('forum.details', 'Details')}</Label>
                  <Textarea
                    id="content"
                    placeholder={t('forum.detailsPlaceholder', 'Describe your question in detail...')}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="min-h-[120px]"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim() || submittingPost}
                >
                  {submittingPost && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {t('forum.postQuestion', 'Post Question')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4">
          <TabsList className="w-full overflow-x-auto flex-wrap h-auto gap-1 bg-transparent p-0">
            <TabsTrigger value="all" className="flex-shrink-0">
              {t('forum.all', 'All')}
            </TabsTrigger>
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="flex-shrink-0">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? t('forum.noResults', 'No questions matching your search')
                  : t('forum.noPosts', 'No questions yet. Be the first to ask!')}
              </p>
              <Button className="mt-4" onClick={() => setShowNewPost(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('forum.askFirst', 'Ask the First Question')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPost(post)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author?.avatar_url || undefined} />
                      <AvatarFallback>
                        {post.author?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{post.title}</h3>
                        {post.is_solved && (
                          <Badge variant="default" className="bg-success flex-shrink-0">
                            <CheckCircle className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          {post.author?.full_name || t('forum.anonymous', 'Anonymous')}
                          {post.author && post.author.reputation_score && post.author.reputation_score >= 20 && (
                            <ExpertBadge
                              reputationScore={post.author.reputation_score || 0}
                              acceptedAnswers={post.author.accepted_answers || 0}
                              totalReplies={post.author.total_replies || 0}
                            />
                          )}
                        </span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                        <span>{formatDate(post.created_at)}</span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.replies_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Forum;
