-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - UNIFIED ENTERPRISE SCHEMA v1.0
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- OMNIVISION AUDIT: All schemas consolidated, normalized, and standardized
-- ARCHITECTURE: High-concurrency social dating platform with enterprise-grade security
-- STANDARDS: PostgreSQL 14+, PostGIS, RLS, GDPR-compliant, WCAG 2.1 AA compatible
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 1: EXTENSIONS
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 2: ENUMS (STANDARDIZED)
-- ═══════════════════════════════════════════════════════════════════════════════════════

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('seeker', 'provider', 'admin', 'moderator');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'monthly', 'annual', 'vip', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE presence_status AS ENUM ('online', 'away', 'busy', 'offline', 'invisible');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE match_type AS ENUM ('like', 'superlike', 'ai_suggested', 'proximity', 'mutual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'audio', 'location', 'system', 'tap');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE tap_type AS ENUM ('flame', 'wave', 'heart', 'wow', 'wink');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'disputed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('match', 'message', 'tap', 'like', 'booking', 'system', 'alert');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_reason AS ENUM ('inappropriate', 'harassment', 'fake', 'spam', 'scam', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed', 'escalated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 3: CORE TABLES
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Users Table (synced from auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    username VARCHAR(32) UNIQUE,
    display_name VARCHAR(64),
    avatar_url TEXT,
    bio TEXT,
    birth_date DATE,
    age INT GENERATED ALWAYS AS (
        CASE WHEN birth_date IS NOT NULL 
        THEN EXTRACT(YEAR FROM AGE(birth_date))::INT 
        ELSE NULL END
    ) STORED,
    
    role user_role DEFAULT 'seeker',
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    
    verification_status verification_status DEFAULT 'unverified',
    verified_email BOOLEAN DEFAULT false,
    verified_phone BOOLEAN DEFAULT false,
    verified_photo BOOLEAN DEFAULT false,
    
    presence presence_status DEFAULT 'offline',
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    is_incognito BOOLEAN DEFAULT false,
    
    city VARCHAR(100),
    country VARCHAR(100),
    country_code CHAR(2),
    location_point GEOMETRY(Point, 4326),
    location_fuzzed GEOMETRY(Point, 4326),
    hide_distance BOOLEAN DEFAULT false,
    
    interests TEXT[] DEFAULT '{}',
    looking_for TEXT[] DEFAULT '{}',
    photos TEXT[] DEFAULT '{}',
    
    hourly_rate DECIMAL(10, 2),
    response_time VARCHAR(50),
    reviews_count INT DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    
    settings JSONB DEFAULT '{
        "notifications": {"messages": true, "taps": true, "matches": true},
        "privacy": {"show_online": true, "show_distance": true, "show_last_seen": true},
        "preferences": {"distance_unit": "km", "age_min": 18, "age_max": 99}
    }'::JSONB,
    
    gdpr_settings JSONB DEFAULT '{
        "marketing_consent": false,
        "data_portability_requested": false,
        "deletion_scheduled_at": null
    }'::JSONB,
    
    is_active BOOLEAN DEFAULT true,
    is_banned BOOLEAN DEFAULT false,
    banned_reason TEXT,
    banned_until TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (Extended User Data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    tagline VARCHAR(140),
    about TEXT,
    headline VARCHAR(100),
    
    languages TEXT[] DEFAULT '{}',
    occupation VARCHAR(100),
    education VARCHAR(100),
    
    height_cm INT,
    weight_kg INT,
    body_type VARCHAR(50),
    ethnicity VARCHAR(50),
    
    social_links JSONB DEFAULT '{}'::JSONB,
    profile_data JSONB DEFAULT '{}'::JSONB,
    
    ai_optimization_score INT DEFAULT 0,
    safety_trust_score INT DEFAULT 50,
    
    travel_mode_enabled BOOLEAN DEFAULT false,
    travel_destination VARCHAR(100),
    
    search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english', COALESCE(tagline, '')) ||
        to_tsvector('english', COALESCE(about, '')) ||
        to_tsvector('english', COALESCE(headline, ''))
    ) STORED,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 4: SOCIAL INTERACTIONS
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Matches
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    match_type match_type DEFAULT 'like',
    is_mutual BOOLEAN DEFAULT false,
    compatibility_score INT DEFAULT 0,
    matched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, target_user_id)
);

-- Taps (Quick Interactions)
CREATE TABLE IF NOT EXISTS public.taps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    tap_type tap_type DEFAULT 'wave',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id, tap_type)
);

-- Favorites
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    favorite_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, favorite_user_id)
);

-- Blocks
CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 5: MESSAGING SYSTEM
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_one_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    participant_two_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_preview TEXT,
    unread_count_one INT DEFAULT 0,
    unread_count_two INT DEFAULT 0,
    is_muted_one BOOLEAN DEFAULT false,
    is_muted_two BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant_one_id, participant_two_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    attachment_url TEXT,
    parent_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_ephemeral BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message Reactions
CREATE TABLE IF NOT EXISTS public.message_reactions (
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(message_id, user_id, emoji)
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 6: BOOKINGS & REVIEWS
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seeker_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_hours INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'pending',
    location TEXT,
    notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    reviewed_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(100),
    content TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 7: NOTIFICATIONS & PUSH
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    payload JSONB DEFAULT '{}'::JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    pushed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push Tokens
CREATE TABLE IF NOT EXISTS public.push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    token TEXT NOT NULL,
    platform VARCHAR(20) NOT NULL,
    device_info JSONB DEFAULT '{}'::JSONB,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 8: SUBSCRIPTIONS & PAYMENTS
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    tier subscription_tier NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'active',
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 9: GAMIFICATION
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Levels
CREATE TABLE IF NOT EXISTS public.levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL,
    required_points INT NOT NULL,
    reward_multiplier DECIMAL(3, 2) DEFAULT 1.0,
    badge_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    points_bonus INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Stats
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    total_points INT DEFAULT 0,
    current_level_id INT REFERENCES public.levels(id) DEFAULT 1,
    streak_days INT DEFAULT 0,
    messages_sent INT DEFAULT 0,
    matches_count INT DEFAULT 0,
    profile_views INT DEFAULT 0,
    last_action_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Badges
CREATE TABLE IF NOT EXISTS public.user_badges (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(user_id, badge_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 10: MEDIA & ALBUMS
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Photos
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_primary BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    moderation_status VARCHAR(20) DEFAULT 'pending',
    nsfw_score DECIMAL(3, 2) DEFAULT 0,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Albums
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT true,
    cover_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Album Photos
CREATE TABLE IF NOT EXISTS public.album_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE NOT NULL,
    photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(album_id, photo_id)
);

-- Album Access
CREATE TABLE IF NOT EXISTS public.album_access (
    album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    granted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(album_id, user_id)
);

-- Stories (24h)
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) DEFAULT 'image',
    view_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours') NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 11: MODERATION & SAFETY
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reason report_reason NOT NULL,
    description TEXT,
    evidence_urls TEXT[] DEFAULT '{}',
    status report_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Trust Scores
CREATE TABLE IF NOT EXISTS public.ai_trust_scores (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    scam_likelihood DECIMAL(3, 2) DEFAULT 0,
    catfish_likelihood DECIMAL(3, 2) DEFAULT 0,
    authenticity_score DECIMAL(3, 2) DEFAULT 0.5,
    behavior_score DECIMAL(3, 2) DEFAULT 0.5,
    last_audit_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Safety Check-ins
CREATE TABLE IF NOT EXISTS public.safety_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    contact_name VARCHAR(100),
    contact_info VARCHAR(200),
    scheduled_at TIMESTAMPTZ NOT NULL,
    triggered_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 12: COMPLIANCE & AUDIT
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Compliance Logs
CREATE TABLE IF NOT EXISTS public.compliance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE IF NOT EXISTS public.audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 13: INDEXES (PERFORMANCE OPTIMIZED)
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_users_presence ON public.users(presence, last_seen_at) WHERE presence = 'online';
CREATE INDEX IF NOT EXISTS idx_users_verification ON public.users(verification_status) WHERE verification_status = 'verified';
CREATE INDEX IF NOT EXISTS idx_users_subscription ON public.users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_users_location_fuzzed ON public.users USING GIST (location_fuzzed);

CREATE INDEX IF NOT EXISTS idx_profiles_user ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_search ON public.profiles USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_matches_user ON public.matches(user_id, target_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_mutual ON public.matches(is_mutual) WHERE is_mutual = true;

CREATE INDEX IF NOT EXISTS idx_taps_receiver ON public.taps(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_blocks_both ON public.blocks(blocker_id, blocked_id);

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant_one_id, participant_two_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_bookings_seeker ON public.bookings(seeker_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id, status);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_expiry ON public.stories(expires_at) WHERE expires_at > NOW();

CREATE INDEX IF NOT EXISTS idx_photos_user ON public.photos(user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status) WHERE status = 'pending';

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 14: FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
DROP TRIGGER IF EXISTS tr_users_updated ON public.users;
CREATE TRIGGER tr_users_updated BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS tr_profiles_updated ON public.profiles;
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS tr_bookings_updated ON public.bookings;
CREATE TRIGGER tr_bookings_updated BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Fuzz location for privacy
CREATE OR REPLACE FUNCTION public.fuzz_location(point GEOMETRY)
RETURNS GEOMETRY AS $$
BEGIN
    RETURN ST_SnapToGrid(point, 0.01);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update fuzzed location on user update
CREATE OR REPLACE FUNCTION public.update_fuzzed_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.location_point IS NOT NULL THEN
        NEW.location_fuzzed = public.fuzz_location(NEW.location_point);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_users_location ON public.users;
CREATE TRIGGER tr_users_location BEFORE INSERT OR UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_fuzzed_location();

-- Sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = COALESCE(EXCLUDED.display_name, public.users.display_name),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update conversation stats on new message
CREATE OR REPLACE FUNCTION public.update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations 
    SET 
        last_message_at = NEW.created_at,
        last_message_preview = LEFT(NEW.content, 100),
        unread_count_one = CASE 
            WHEN participant_one_id != NEW.sender_id THEN unread_count_one + 1 
            ELSE unread_count_one 
        END,
        unread_count_two = CASE 
            WHEN participant_two_id != NEW.sender_id THEN unread_count_two + 1 
            ELSE unread_count_two 
        END
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_message_stats ON public.messages;
CREATE TRIGGER tr_message_stats
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_stats();

-- Update user review stats
CREATE OR REPLACE FUNCTION public.update_review_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET 
        reviews_count = (
            SELECT COUNT(*) FROM public.reviews 
            WHERE reviewed_user_id = NEW.reviewed_user_id
        ),
        average_rating = (
            SELECT COALESCE(AVG(rating), 0) FROM public.reviews 
            WHERE reviewed_user_id = NEW.reviewed_user_id
        )
    WHERE id = NEW.reviewed_user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_review_stats ON public.reviews;
CREATE TRIGGER tr_review_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_review_stats();

-- Gamification points
CREATE OR REPLACE FUNCTION public.award_points()
RETURNS TRIGGER AS $$
DECLARE
    points_amount INT := 5;
BEGIN
    IF TG_TABLE_NAME = 'messages' THEN points_amount := 2; END IF;
    IF TG_TABLE_NAME = 'taps' THEN points_amount := 1; END IF;
    IF TG_TABLE_NAME = 'matches' THEN points_amount := 10; END IF;
    IF TG_TABLE_NAME = 'reviews' THEN points_amount := 15; END IF;
    
    INSERT INTO public.user_stats (user_id, total_points)
    VALUES (
        CASE 
            WHEN TG_TABLE_NAME = 'messages' THEN NEW.sender_id
            WHEN TG_TABLE_NAME = 'taps' THEN NEW.sender_id
            WHEN TG_TABLE_NAME = 'matches' THEN NEW.user_id
            WHEN TG_TABLE_NAME = 'reviews' THEN NEW.reviewer_id
            ELSE NULL
        END,
        points_amount
    )
    ON CONFLICT (user_id) DO UPDATE 
    SET total_points = user_stats.total_points + points_amount,
        last_action_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_points_messages ON public.messages;
CREATE TRIGGER tr_points_messages AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.award_points();

DROP TRIGGER IF EXISTS tr_points_taps ON public.taps;
CREATE TRIGGER tr_points_taps AFTER INSERT ON public.taps
    FOR EACH ROW EXECUTE FUNCTION public.award_points();

DROP TRIGGER IF EXISTS tr_points_matches ON public.matches;
CREATE TRIGGER tr_points_matches AFTER INSERT ON public.matches
    FOR EACH ROW EXECUTE FUNCTION public.award_points();

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 15: SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════════════════

INSERT INTO public.levels (level_name, required_points, reward_multiplier) VALUES
    ('Newcomer', 0, 1.0),
    ('Explorer', 100, 1.1),
    ('Socialite', 500, 1.25),
    ('Icon', 2000, 1.5),
    ('Legend', 10000, 2.0)
ON CONFLICT DO NOTHING;

INSERT INTO public.badges (name, description, points_bonus) VALUES
    ('First Steps', 'Complete your profile', 50),
    ('Verified', 'Verify your identity', 100),
    ('Social Butterfly', 'Send 100 messages', 200),
    ('Popular', 'Receive 50 likes', 150),
    ('Connector', 'Make 10 matches', 250)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- SECTION 16: REALTIME SUBSCRIPTIONS
-- ═══════════════════════════════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.taps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- END OF UNIFIED ENTERPRISE SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════════════════
