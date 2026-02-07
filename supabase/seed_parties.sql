-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - SEED PARTIES SCRIPT
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- Data: Manual Population
-- Run this script in Supabase SQL Editor to populate the app with fake parties
-- so the "Party" screen is not empty.
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Get a user ID to use as host (or create a dummy one if empty)
DO $$
DECLARE
    host_uid UUID;
BEGIN
    SELECT id INTO host_uid FROM public.users LIMIT 1;
    
    -- If no user exists, we can't insert parties reliably with FK constraints.
    -- Assuming seed_profiles.sql was run and we have users, or we use a placeholder.
    -- For this script, we'll try to find one.
    
    IF host_uid IS NOT NULL THEN
        INSERT INTO public.parties (host_id, title, description, location, date, time, image_url, type, max_attendees)
        VALUES
        (host_uid, 'Rooftop Sunset Drinks', 'Chill vibes with a view.', 'Sky Bar, Downtown', CURRENT_DATE, '20:00', 'https://images.unsplash.com/photo-1519671482538-307996eed42f?w=800&q=80', 'drinks', 20),
        (host_uid, 'Sunday Morning Yoga', 'Start the day right.', 'Central Park', CURRENT_DATE + 1, '09:00', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80', 'gym', 15),
        (host_uid, 'Tech Networking Mixer', 'Connect with innovators.', 'Innovation Hub', CURRENT_DATE + 2, '18:00', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80', 'meetup', 50);
    END IF;
END $$;
