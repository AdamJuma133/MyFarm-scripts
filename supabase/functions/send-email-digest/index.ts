import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@4.0.0';

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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

    const digests: { userId: string; name: string; email?: string; matchingPosts: ForumPost[] }[] = [];

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
        // Get user email
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);
        
        if (!userError && user?.email) {
          digests.push({
            userId: profile.user_id,
            name: profile.full_name || 'Farmer',
            email: user.email,
            matchingPosts,
          });
        }
      }
    }

    const digestResults = [];
    
    for (const digest of digests) {
      if (!digest.email) continue;

      // Create HTML email content
      const postsHtml = digest.matchingPosts.slice(0, 5).map(post => `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #16a34a; font-size: 16px;">${post.title}</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            ${post.crop_type ? `🌱 ${post.crop_type}` : ''} • 💬 ${post.replies_count} replies
          </p>
        </div>
      `).join('');

      const htmlEmail = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #16a34a; margin: 0;">🌾 MyFarm Weekly Digest</h1>
            <p style="color: #6b7280; margin: 10px 0 0 0;">Your personalized forum activity summary</p>
          </div>
          
          <p style="font-size: 16px;">Hi ${digest.name},</p>
          
          <p style="font-size: 14px; color: #4b5563;">
            Here are ${digest.matchingPosts.length} new discussion${digest.matchingPosts.length > 1 ? 's' : ''} about your crops from the past week:
          </p>
          
          ${postsHtml}
          
          ${digest.matchingPosts.length > 5 ? `<p style="color: #6b7280; font-size: 14px;">...and ${digest.matchingPosts.length - 5} more posts</p>` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://agri-scann-ai.lovable.app/forum" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              View All Discussions
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            You're receiving this because you enabled weekly email digests.<br>
            <a href="https://agri-scann-ai.lovable.app/settings" style="color: #16a34a;">Manage your notification preferences</a>
          </p>
        </body>
        </html>
      `;

      if (resend) {
        // Send actual email via Resend
        try {
          const { error: emailError } = await resend.emails.send({
            from: 'MyFarm <digest@resend.dev>',
            to: [digest.email],
            subject: `🌾 ${digest.matchingPosts.length} new discussions about your crops this week`,
            html: htmlEmail,
          });

          if (emailError) {
            console.error('Resend error:', emailError);
            // Fall back to notification
            await supabase.from('notifications').insert({
              user_id: digest.userId,
              type: 'email_digest',
              title: 'Weekly Forum Digest',
              message: `${digest.matchingPosts.length} new posts about your crops this week`,
              link: '/forum',
            });
            digestResults.push({
              userId: digest.userId,
              email: digest.email,
              postsCount: digest.matchingPosts.length,
              status: 'fallback_notification',
            });
          } else {
            digestResults.push({
              userId: digest.userId,
              email: digest.email,
              postsCount: digest.matchingPosts.length,
              status: 'email_sent',
            });
          }
        } catch (emailErr) {
          console.error('Email send error:', emailErr);
          // Fall back to notification
          await supabase.from('notifications').insert({
            user_id: digest.userId,
            type: 'email_digest',
            title: 'Weekly Forum Digest',
            message: `${digest.matchingPosts.length} new posts about your crops this week`,
            link: '/forum',
          });
          digestResults.push({
            userId: digest.userId,
            email: digest.email,
            postsCount: digest.matchingPosts.length,
            status: 'fallback_notification',
          });
        }
      } else {
        // No Resend API key, create in-app notification
        await supabase.from('notifications').insert({
          user_id: digest.userId,
          type: 'email_digest',
          title: 'Weekly Forum Digest',
          message: `${digest.matchingPosts.length} new posts about your crops this week`,
          link: '/forum',
        });
        digestResults.push({
          userId: digest.userId,
          email: digest.email,
          postsCount: digest.matchingPosts.length,
          status: 'notification_created',
        });
      }
    }

    console.log(`Processed ${digests.length} digests, sent ${digestResults.filter(r => r.status === 'email_sent').length} emails`);

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
