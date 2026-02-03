-- The current policy only allows users to view their own profile
-- This breaks the forum where we need to see author names
-- We need to allow authenticated users to read basic profile info (non-sensitive fields)

-- Solution: Keep the restrictive policy for own profile (full access)
-- Add a policy that allows reading limited fields for any profile
-- However, RLS doesn't support column-level access control

-- Alternative approach: Create a view with only public fields
-- But the simpler approach is to allow authenticated users to see all profiles
-- since the profile table only contains non-sensitive public info (name, avatar, farm details, reputation)

-- Looking at the profiles table:
-- - full_name, farm_name, farm_location, farm_size, primary_crops, avatar_url - public info
-- - reputation_score, accepted_answers, total_replies - public stats
-- - email_digest_enabled - preference (not sensitive)
-- None of these fields are sensitive personal data like emails (which are in auth.users)

-- So we can safely allow authenticated users to view all profiles
-- This is actually the original behavior we broke

-- Add policy for authenticated users to view all profiles (for forum author display)
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);