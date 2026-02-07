-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - SECURITY FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- Security: Helper Functions for RLS
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Function to check if users have matched
CREATE OR REPLACE FUNCTION public.have_users_matched(user1 uuid, user2 uuid)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.matches
        WHERE is_mutual = true
        AND ((user_id = user1 AND target_user_id = user2)
             OR (user_id = user2 AND target_user_id = user1))
    );
END;
$$;

-- Function to enforce block restrictions
CREATE OR REPLACE FUNCTION public.is_blocked(check_user uuid, by_user uuid)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.blocks
        WHERE blocker_id = by_user AND blocked_id = check_user
    );
END;
$$;