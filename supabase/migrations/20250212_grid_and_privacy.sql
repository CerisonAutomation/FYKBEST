-- ═══════════════════════════════════════════════════════════════════════════════════════
-- KING SOCIAL ZENITH - GRID & ALBUM UPGRADE v1.2
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- 1. ALBUMS & ITEMS
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    privacy TEXT NOT NULL DEFAULT 'private' CHECK (privacy IN ('public','friends','matches','private')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.album_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Album Access Requests
CREATE TABLE IF NOT EXISTS public.album_access_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.users(id),
    owner_id UUID NOT NULL REFERENCES public.users(id),
    album_id UUID NOT NULL REFERENCES public.albums(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(requester_id, album_id)
);

-- 2. STORIES (Ephemeral)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. THE MASTER GRID RPC (Keyset Pagination + Filters)
CREATE OR REPLACE FUNCTION public.get_zenith_grid(
  p_viewer_id UUID,
  p_center GEOGRAPHY DEFAULT NULL,
  p_min_age INTEGER DEFAULT 18,
  p_max_age INTEGER DEFAULT 99,
  p_verified_only BOOLEAN DEFAULT false,
  p_limit INTEGER DEFAULT 40,
  p_cursor_id UUID DEFAULT NULL,
  p_cursor_value NUMERIC DEFAULT NULL -- Can be distance or popularity
)
RETURNS TABLE (
  profile_id UUID,
  display_name TEXT,
  age INTEGER,
  avatar_url TEXT,
  city TEXT,
  distance_m INTEGER,
  is_online BOOLEAN,
  verification_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.display_name,
    p.age,
    p.avatar_url,
    p.city,
    CAST(ST_Distance(u.location_point, p_center) AS INTEGER) as distance_m,
    u.online_status,
    p.verification_status
  FROM public.profiles p
  JOIN public.users u ON p.user_id = u.id
  WHERE u.id <> p_viewer_id
    AND NOT public.fn_is_blocked(p_viewer_id, u.id)
    AND p.age BETWEEN p_min_age AND p_max_age
    AND (NOT p_verified_only OR p.verification_status = 'verified')
    AND (p_cursor_id IS NULL OR p.user_id > p_cursor_id) -- Simple keyset by ID for v0
  ORDER BY p.user_id ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- RLS for Albums
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY album_view_policy ON public.albums FOR SELECT
USING (
    user_id = auth.uid() OR 
    privacy = 'public' OR
    (privacy = 'matches' AND public.fn_is_match(auth.uid(), user_id)) OR
    EXISTS (SELECT 1 FROM album_access_requests WHERE album_id = id AND requester_id = auth.uid() AND status = 'approved')
);
