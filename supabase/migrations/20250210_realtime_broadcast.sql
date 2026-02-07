-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - REALTIME BROADCAST INFRASTRUCTURE
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- Security: Realtime Broadcast System
-- Performance: High-performance event delivery via Broadcast from Database
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- 1. Create Broadcast Function
CREATE OR REPLACE FUNCTION public.notify_broadcast_payload()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    topic_name text;
BEGIN
    -- Determine topic based on table
    CASE TG_TABLE_NAME
        WHEN 'messages' THEN
            -- Broadcast to the receiver
            topic_name := 'user:' || NEW.receiver_id::text || ':messages';
        WHEN 'notifications' THEN
            topic_name := 'user:' || NEW.user_id::text || ':notifications';
        WHEN 'bookings' THEN
            -- Notify both seeker and provider
            PERFORM pg_catalog.realtime.send(
                'user:' || NEW.seeker_id::text || ':bookings',
                'booking_created',
                pg_catalog.to_jsonb(NEW),
                true -- private
            );
            PERFORM pg_catalog.realtime.send(
                'user:' || NEW.provider_id::text || ':bookings',
                'booking_created',
                pg_catalog.to_jsonb(NEW),
                true -- private
            );
            RETURN NEW;
        WHEN 'parties' THEN
            topic_name := 'global:parties';
        WHEN 'favorites' THEN
            topic_name := 'user:' || NEW.user_id::text || ':sync';
        WHEN 'subscriptions' THEN
            topic_name := 'user:' || NEW.user_id::text || ':sync';
        ELSE
            topic_name := 'global:events';
    END CASE;

    -- Use realtime.send for custom event naming
    PERFORM pg_catalog.realtime.send(
        topic_name,
        TG_TABLE_NAME || '_' || LOWER(TG_OP),
        pg_catalog.to_jsonb(NEW),
        true -- private
    );

    RETURN NEW;
END;
$$;

-- 2. Attach Triggers
DROP TRIGGER IF EXISTS tr_broadcast_messages ON public.messages;
CREATE TRIGGER tr_broadcast_messages AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.notify_broadcast_payload();

DROP TRIGGER IF EXISTS tr_broadcast_notifications ON public.notifications;
CREATE TRIGGER tr_broadcast_notifications AFTER INSERT ON public.notifications
FOR EACH ROW EXECUTE FUNCTION public.notify_broadcast_payload();

DROP TRIGGER IF EXISTS tr_broadcast_bookings ON public.bookings;
CREATE TRIGGER tr_broadcast_bookings AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_broadcast_payload();

DROP TRIGGER IF EXISTS tr_broadcast_parties ON public.parties;
CREATE TRIGGER tr_broadcast_parties AFTER INSERT OR UPDATE ON public.parties
FOR EACH ROW EXECUTE FUNCTION public.notify_broadcast_payload();

DROP TRIGGER IF EXISTS tr_broadcast_favorites ON public.favorites;
CREATE TRIGGER tr_broadcast_favorites AFTER INSERT OR DELETE ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.notify_broadcast_payload();

DROP TRIGGER IF EXISTS tr_broadcast_subscriptions ON public.subscriptions;
CREATE TRIGGER tr_broadcast_subscriptions AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.notify_broadcast_payload();

-- 3. Setup RLS for realtime.messages
-- Users can only read broadcasts for topics they own
ALTER TABLE pg_catalog.realtime.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own realtime broadcasts."
ON pg_catalog.realtime.messages
FOR SELECT
TO authenticated
USING (
    topic = 'global:parties' OR
    topic = 'global:events' OR
    topic LIKE 'user:' || (select auth.uid())::text || ':%'
);

-- 4. Add Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_seeker_id ON public.bookings(seeker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
