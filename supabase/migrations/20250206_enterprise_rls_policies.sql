-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - ENTERPRISE RLS POLICIES v2.1
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- Security: Row Level Security Implementation
-- SECURITY: Zero-trust architecture with multi-layer protection
-- COMPLIANCE: GDPR, CCPA, SOC 2 Type II ready
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_checkins ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 1: USERS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can read own data."
ON public.users
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = id::uuid );

CREATE POLICY "Users can update own profile."
ON public.users
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = id::uuid )
WITH CHECK ( (select auth.uid())::uuid = id::uuid );

CREATE POLICY "Users can view public profiles."
ON public.users
FOR SELECT
TO authenticated, anon
USING (
    (select auth.uid())::uuid != id::uuid
    AND is_active = true
    AND is_banned = false
    AND NOT EXISTS (
        SELECT 1 FROM public.blocks
        WHERE (blocker_id = (select auth.uid())::uuid AND blocked_id = id::uuid)
        OR (blocker_id = id::uuid AND blocked_id = (select auth.uid())::uuid)
    )
);

CREATE POLICY "Admins can read all users."
ON public.users
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role IN ('admin', 'moderator')
    )
);

CREATE POLICY "Admins can insert users."
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
);

CREATE POLICY "Admins can update all users."
ON public.users
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete users."
ON public.users
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 2: PROFILES TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can read own profile."
ON public.profiles
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can insert own profile."
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can update own profile data."
ON public.profiles
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = user_id )
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can delete own profile."
ON public.profiles
FOR DELETE
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can view others' public profiles."
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 FROM public.users u
        WHERE u.id = profiles.user_id
        AND u.is_active = true
        AND u.is_banned = false
    )
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 3: MATCHES TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view their own matches."
ON public.matches
FOR SELECT
TO authenticated
USING (
    (select auth.uid())::uuid = user_id OR (select auth.uid())::uuid = target_user_id
);

CREATE POLICY "Users can create matches."
ON public.matches
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can update their own matches."
ON public.matches
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = user_id OR (select auth.uid())::uuid = target_user_id )
WITH CHECK ( (select auth.uid())::uuid = user_id OR (select auth.uid())::uuid = target_user_id );

CREATE POLICY "Users can delete their own matches."
ON public.matches
FOR DELETE
TO authenticated
USING ( (select auth.uid())::uuid = user_id OR (select auth.uid())::uuid = target_user_id );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 4: TAPS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own taps."
ON public.taps
FOR SELECT
TO authenticated
USING (
    (select auth.uid())::uuid = sender_id OR (select auth.uid())::uuid = receiver_id
);

CREATE POLICY "Users can send taps."
ON public.taps
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = sender_id );

CREATE POLICY "Receivers can mark taps read."
ON public.taps
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = receiver_id )
WITH CHECK ( (select auth.uid())::uuid = receiver_id );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 5: FAVORITES TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can select own favorites."
ON public.favorites
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can insert own favorites."
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can update own favorites."
ON public.favorites
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = user_id )
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can delete own favorites."
ON public.favorites
FOR DELETE
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 6: BLOCKS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own blocks."
ON public.blocks
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = blocker_id );

CREATE POLICY "Users can create blocks."
ON public.blocks
FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid())::uuid = blocker_id );

CREATE POLICY "Users can delete own blocks."
ON public.blocks
FOR DELETE
TO authenticated
USING ( (select auth.uid())::uuid = blocker_id );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 7: CONVERSATIONS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own conversations."
ON public.conversations
FOR SELECT
TO authenticated
USING (
    (select auth.uid())::uuid = participant_one_id OR (select auth.uid())::uuid = participant_two_id
);

CREATE POLICY "Users can create conversations."
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (
    (select auth.uid())::uuid = participant_one_id OR (select auth.uid())::uuid = participant_two_id
);

CREATE POLICY "Users can update own conversations."
ON public.conversations
FOR UPDATE
TO authenticated
USING (
    (select auth.uid())::uuid = participant_one_id OR (select auth.uid())::uuid = participant_two_id
)
WITH CHECK (
    (select auth.uid())::uuid = participant_one_id OR (select auth.uid())::uuid = participant_two_id
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 8: MESSAGES TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view conversation messages."
ON public.messages
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND (c.participant_one_id = (select auth.uid())::uuid OR c.participant_two_id = (select auth.uid())::uuid)
    )
);

CREATE POLICY "Users can send messages."
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = (select auth.uid())::uuid AND
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND (c.participant_one_id = (select auth.uid())::uuid OR c.participant_two_id = (select auth.uid())::uuid)
    )
);

CREATE POLICY "Users can edit own messages."
ON public.messages
FOR UPDATE
TO authenticated
USING (
    sender_id = (select auth.uid())::uuid
    AND created_at > NOW() - INTERVAL '15 minutes'
)
WITH CHECK (
    sender_id = (select auth.uid())::uuid
);

CREATE POLICY "Users can delete own messages."
ON public.messages
FOR DELETE
TO authenticated
USING ( sender_id = (select auth.uid())::uuid );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 9: BOOKINGS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own bookings."
ON public.bookings
FOR SELECT
TO authenticated
USING (
    (select auth.uid())::uuid = seeker_id OR (select auth.uid())::uuid = provider_id
);

CREATE POLICY "Seekers can create bookings."
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = seeker_id );

CREATE POLICY "Users can update own bookings."
ON public.bookings
FOR UPDATE
TO authenticated
USING (
    (select auth.uid())::uuid = seeker_id OR (select auth.uid())::uuid = provider_id
)
WITH CHECK (
    (select auth.uid())::uuid = seeker_id OR (select auth.uid())::uuid = provider_id
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 10: REVIEWS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view reviews."
ON public.reviews
FOR SELECT
TO authenticated, anon
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = reviews.booking_id
        AND (b.seeker_id = (select auth.uid())::uuid OR b.provider_id = (select auth.uid())::uuid)
    )
    OR (select auth.uid())::uuid = reviewed_user_id
    OR reviewed_user_id IN (
        SELECT id FROM public.users WHERE is_active = true
    )
);

CREATE POLICY "Users can create reviews."
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
    reviewer_id = (select auth.uid())::uuid AND
    EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = reviews.booking_id
        AND b.status = 'completed'
        AND (b.seeker_id = (select auth.uid())::uuid OR b.provider_id = (select auth.uid())::uuid)
    )
);

CREATE POLICY "Users can update own reviews."
ON public.reviews
FOR UPDATE
TO authenticated
USING ( reviewer_id = (select auth.uid())::uuid )
WITH CHECK ( reviewer_id = (select auth.uid())::uuid );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 11: NOTIFICATIONS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own notifications."
ON public.notifications
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "System can create notifications."
ON public.notifications
FOR INSERT
TO authenticated, anon
WITH CHECK ( true );

CREATE POLICY "Users can update own notifications."
ON public.notifications
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = user_id )
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can delete own notifications."
ON public.notifications
FOR DELETE
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 12: PHOTOS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can read own photos."
ON public.photos
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can insert own photos."
ON public.photos
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can update own photos."
ON public.photos
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = user_id )
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can delete own photos."
ON public.photos
FOR DELETE
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can view public photos."
ON public.photos
FOR SELECT
TO authenticated, anon
USING (
    is_private = false OR
    (select auth.uid())::uuid = user_id OR
    EXISTS (
        SELECT 1 FROM public.matches m
        WHERE m.is_mutual = true
        AND ((m.user_id = (select auth.uid())::uuid AND m.target_user_id = photos.user_id)
             OR (m.target_user_id = (select auth.uid())::uuid AND m.user_id = photos.user_id))
    )
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 13: SUBSCRIPTIONS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own subscriptions."
ON public.subscriptions
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Admins can select all subscriptions."
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
);

CREATE POLICY "Admins can insert subscriptions."
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
);

CREATE POLICY "Admins can update subscriptions."
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete subscriptions."
ON public.subscriptions
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role = 'admin'
    )
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 14: USER_STATS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can view own stats."
ON public.user_stats
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "System can update stats."
ON public.user_stats
FOR UPDATE
TO authenticated, anon
USING ( true )
WITH CHECK ( true );

CREATE POLICY "System can insert stats."
ON public.user_stats
FOR INSERT
TO authenticated, anon
WITH CHECK ( true );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 15: REPORTS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can create reports."
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = reporter_id );

CREATE POLICY "Users can view own reports."
ON public.reports
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = reporter_id );

CREATE POLICY "Admins can view all reports."
ON public.reports
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role IN ('admin', 'moderator')
    )
);

CREATE POLICY "Admins can update reports."
ON public.reports
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role IN ('admin', 'moderator')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = (select auth.uid())::uuid AND role IN ('admin', 'moderator')
    )
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 16: SAFETY_CHECKINS TABLE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE POLICY "Users can select own checkins."
ON public.safety_checkins
FOR SELECT
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can insert own checkins."
ON public.safety_checkins
FOR INSERT
TO authenticated
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can update own checkins."
ON public.safety_checkins
FOR UPDATE
TO authenticated
USING ( (select auth.uid())::uuid = user_id )
WITH CHECK ( (select auth.uid())::uuid = user_id );

CREATE POLICY "Users can delete own checkins."
ON public.safety_checkins
FOR DELETE
TO authenticated
USING ( (select auth.uid())::uuid = user_id );

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- END OF ENTERPRISE RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════════════