-- ═══════════════════════════════════════════════════════════════════════════════════════
-- KING SOCIAL ZENITH - CORE MIGRATION v1.1
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- PostGIS Proximity + Unified Events + MeetNow + Security
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. BLOCKS (The Invisibility Shield)
CREATE TABLE IF NOT EXISTS public.blocks (
    blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id)
);

-- Invisibility Function
CREATE OR REPLACE FUNCTION public.fn_is_blocked(user_a TEXT, user_b TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocks
    WHERE (blocker_id::text = user_a AND blocked_id::text = user_b)
       OR (blocker_id::text = user_b AND blocked_id::text = user_a)
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. UNIFIED EVENTS (Plans + Parties)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'plan' CHECK (event_type IN ('plan','party'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location_point GEOGRAPHY(Point, 4326);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS address_public TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS address_precise TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS address_revealed_policy TEXT NOT NULL DEFAULT 'reveal_on_approved'
    CHECK (address_revealed_policy IN ('reveal_on_approved','reveal_on_checkin','reveal_2h_before'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS quiet_mode BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS panic_end_activated BOOLEAN NOT NULL DEFAULT false;

-- Events Secure View
CREATE OR REPLACE VIEW public.events_secure_view AS
SELECT
    e.id, e.organizer_id as creator_id, e.event_type, e.title, e.description,
    e.location_point, e.address_public, e.start_time, e.end_time,
    e.quiet_mode, e.panic_end_activated, e.created_at,
    CASE
        WHEN e.event_type <> 'party' THEN e.address_precise
        WHEN e.organizer_id = auth.uid() THEN e.address_precise
        WHEN e.address_revealed_policy = 'reveal_on_checkin'
          AND EXISTS(SELECT 1 FROM public.bookings b WHERE b.provider_id = e.organizer_id AND b.seeker_id = auth.uid() AND b.status = 'confirmed')
          THEN e.address_precise -- Using bookings as a proxy for RSVPs in v0
        WHEN e.address_revealed_policy = 'reveal_on_approved'
          AND EXISTS(SELECT 1 FROM public.favorites f WHERE f.user_id::uuid = e.organizer_id AND f.favorite_user_id = auth.uid())
          THEN e.address_precise
        ELSE NULL
    END AS address_precise_visible
FROM public.events e
WHERE NOT public.fn_is_blocked(e.organizer_id::text, auth.uid()::text);

-- 3. MEET NOW (Right Now Sessions)
CREATE TABLE IF NOT EXISTS public.right_now_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status_text TEXT,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','friends','matches','private')),
    radius_km INTEGER NOT NULL DEFAULT 25 CHECK (radius_km BETWEEN 1 AND 200),
    location_point GEOGRAPHY(Point, 4326),
    last_ping_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_incognito BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '60 minutes')
);

CREATE INDEX IF NOT EXISTS idx_rn_active_expires ON public.right_now_sessions (expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_rn_location_gist ON public.right_now_sessions USING GIST (location_point);

-- Proximity Feed RPC
CREATE OR REPLACE FUNCTION public.rn_feed(
  p_center GEOGRAPHY,
  p_radius_m INTEGER,
  p_limit INTEGER,
  p_cursor_expires_at TIMESTAMPTZ DEFAULT NULL,
  p_cursor_user UUID DEFAULT NULL
)
RETURNS TABLE (
  user_id UUID,
  session_id UUID,
  expires_at TIMESTAMPTZ,
  status_text TEXT,
  distance_m INTEGER
)
LANGUAGE sql STABLE
AS $$
  SELECT
    s.user_id::uuid,
    s.id as session_id,
    s.expires_at,
    s.status_text,
    CAST(ST_Distance(s.location_point, p_center) AS INTEGER) as distance_m
  from public.right_now_sessions s
  where s.expires_at > now()
    and s.location_point is not null
    and ST_DWithin(s.location_point, p_center, p_radius_m)
    and (
      p_cursor_expires_at is null
      or (s.expires_at, s.user_id::text) < (p_cursor_expires_at, p_cursor_user::text)
    )
    and not public.fn_is_blocked(s.user_id::text, auth.uid()::text)
  order by s.expires_at desc, s.user_id::text desc
  limit greatest(1, least(p_limit, 100));
$$;

-- RLS
ALTER TABLE public.right_now_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY rn_all_policy ON public.right_now_sessions FOR ALL TO authenticated
USING (NOT public.fn_is_blocked(user_id::text, auth.uid()::text))
WITH CHECK (user_id = auth.uid()::text);
