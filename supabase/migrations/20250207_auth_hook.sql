-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - AUTH HOOKS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- Schema: Automating User Creation
-- Ensures public.users and public.profiles are created when auth.users is created
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    default_role text := 'seeker'; -- Default role
    user_name text;
BEGIN
    -- Extract name from metadata or email
    user_name := new.raw_user_meta_data->>'name';
    IF user_name IS NULL OR user_name = '' THEN
        user_name := pg_catalog.split_part(new.email, '@', 1);
    END IF;

    -- Extract role from metadata if present
    IF new.raw_user_meta_data->>'role' IS NOT NULL THEN
        default_role := new.raw_user_meta_data->>'role';
    END IF;

    -- Insert into public.users
    INSERT INTO public.users (id, email, role, is_active, is_banned, created_at, updated_at)
    VALUES (
        new.id,
        new.email,
        default_role,
        true,
        false,
        pg_catalog.now(),
        pg_catalog.now()
    );

    -- Insert into public.profiles
    INSERT INTO public.profiles (user_id, name, created_at, updated_at)
    VALUES (
        new.id,
        user_name,
        pg_catalog.now(),
        pg_catalog.now()
    );

    RETURN new;
END;
$$;

-- Trigger to call the function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
