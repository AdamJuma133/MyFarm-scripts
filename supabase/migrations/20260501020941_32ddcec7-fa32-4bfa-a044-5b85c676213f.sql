-- Stale device token cleanup
-- Removes tokens not updated in 60 days (likely uninstalled / rotated)

CREATE OR REPLACE FUNCTION public.cleanup_stale_device_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.device_tokens
  WHERE updated_at < now() - interval '60 days';
$$;

-- Restrict execute: only the postgres/cron role should run this
REVOKE ALL ON FUNCTION public.cleanup_stale_device_tokens() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_stale_device_tokens() FROM anon;
REVOKE ALL ON FUNCTION public.cleanup_stale_device_tokens() FROM authenticated;

-- Schedule weekly cleanup (Sundays 03:00 UTC) via pg_cron if available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('cleanup-stale-device-tokens')
      WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-stale-device-tokens');
    PERFORM cron.schedule(
      'cleanup-stale-device-tokens',
      '0 3 * * 0',
      $cron$ SELECT public.cleanup_stale_device_tokens(); $cron$
    );
  END IF;
END $$;