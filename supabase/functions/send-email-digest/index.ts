import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ForumPost {
  id: string;
  title: string;
  content: string;
  crop_type: string | null;
  created_at: string;
  replies_count: number;
}

interface Profile {
  user_id: string;
  full_name: string | null;
  primary_crops: string[] | null;
  email_digest_enabled: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all users with email digest enabled
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name, primary_crops, email_digest_enabled')
      .eq('email_digest_enabled', true);

    if (profilesError) throw profilesError;

    // Get posts from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: recentPosts, error: postsError } = await supabase
      .from('forum_posts')
      .select('id, title, content, crop_type, created_at, replies_count')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;

    const digests: { userId: string; name: string; matchingPosts: ForumPost[] }[] = [];

    // For each user, find posts that match their crops
    for (const profile of profiles || []) {
      if (!profile.primary_crops || profile.primary_crops.length === 0) continue;

      const matchingPosts = (recentPosts || []).filter((post: ForumPost) => {
        if (!post.crop_type) return false;
        return profile.primary_crops!.some((crop: string) => 
          post.crop_type!.toLowerCase().includes(crop.toLowerCase()) ||
          crop.toLowerCase().includes(post.crop_type!.toLowerCase())
        );
      });

      if (matchingPosts.length > 0) {
        digests.push({
          userId: profile.user_id,
          name: profile.full_name || 'Farmer',
          matchingPosts,
        });
      }
    }

    // Get user emails from auth.users using service role
    const digestResults = [];
    
    for (const digest of digests) {
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(digest.userId);
      
      if (userError || !user?.email) continue;

      // Create a notification for the digest (in lieu of actual email sending)
      // In production, you would integrate with an email service like Resend, SendGrid, etc.
      const digestSummary = `${digest.matchingPosts.length} new posts about your crops this week`;
      
      await supabase.from('notifications').insert({
        user_id: digest.userId,
        type: 'email_digest',
        title: 'Weekly Forum Digest',
        message: digestSummary,
        link: '/forum',
      });

      digestResults.push({
        userId: digest.userId,
        email: user.email,
        postsCount: digest.matchingPosts.length,
        status: 'notification_created',
      });
    }

    console.log(`Processed ${digests.length} digests, created ${digestResults.length} notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${digestResults.length} email digests`,
        results: digestResults,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending email digests:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
