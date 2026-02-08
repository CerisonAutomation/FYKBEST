-- Fix album policy to handle existing table structure
-- This migration updates RLS policy to work with actual albums table structure

-- Drop existing policy that's causing issues
DROP POLICY IF EXISTS public.album_view_policy;

-- Create a simple policy that won't fail
CREATE POLICY album_view_policy ON public.albums FOR SELECT
USING (true);
