-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - SEED DATA SCRIPT
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- Data: Manual Population
-- Run this script in Supabase SQL Editor to populate the app with fake users
-- so the "Browse" screen is not empty.
-- 
-- NOTE: This bypasses auth.users creation for simplicity in data viewing.
-- Real users must sign up via the app.
-- ═══════════════════════════════════════════════════════════════════════════════════════

INSERT INTO public.profiles (
    user_id,
    name,
    username,
    age,
    city,
    bio,
    hourly_rate,
    verification_status,
    photos,
    interests,
    tribes,
    created_at,
    updated_at
)
VALUES
(
    uuid_generate_v4(), -- Random UUID since we don't have auth user
    'Marcus Alexander',
    'marcus_a',
    28,
    'New York',
    'Fitness enthusiast & coffee lover. Always looking for the next adventure.',
    150,
    'verified',
    ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&q=80'],
    ARRAY['Fitness', 'Travel', 'Coffee'],
    ARRAY['jock', 'muscle'],
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'Diego Torres',
    'diego_t',
    24,
    'Miami',
    'Chef & wine connoisseur. Let me cook for you.',
    200,
    'verified',
    ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop&q=80'],
    ARRAY['Cooking', 'Wine', 'Dining'],
    ARRAY['otter'],
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'Jordan Smith',
    'jordan_s',
    30,
    'London',
    'Tech geek & craft beer fan. Building the future.',
    180,
    'verified',
    ARRAY['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop&q=80'],
    ARRAY['Tech', 'Gaming', 'Beer'],
    ARRAY['geek', 'bear'],
    NOW(),
    NOW()
);

-- Ensure RLS doesn't block "Select *" for authenticated users on these rows
-- (The existing policy "Users can view public profiles" should handle it if user_id != auth.uid())
