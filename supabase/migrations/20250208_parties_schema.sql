-- ═══════════════════════════════════════════════════════════════════════════════════════
-- FIND YOUR KING - PARTIES & EVENTS SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════════════════
-- Schema: Event Management
-- Adds tables for parties, events, and attendance.
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    image_url TEXT,
    type TEXT CHECK (type IN ('gym', 'cinema', 'meetup', 'drinks', 'food', 'coffee')),
    max_attendees INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.party_attendees (
    party_id UUID NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'attending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (party_id, user_id)
);

-- RLS POLICIES
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_attendees ENABLE ROW LEVEL SECURITY;

-- Parties: Read all, Insert auth, Update own
CREATE POLICY "Parties are viewable by everyone." 
ON public.parties 
FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Authenticated users can create parties." 
ON public.parties 
FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = host_id );

CREATE POLICY "Hosts can update their own parties." 
ON public.parties 
FOR UPDATE 
TO authenticated 
USING ( (select auth.uid()) = host_id ) 
WITH CHECK ( (select auth.uid()) = host_id );

CREATE POLICY "Hosts can delete their own parties." 
ON public.parties 
FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = host_id );

-- Attendees: Read all, Insert/Delete own
CREATE POLICY "Attendees are viewable by everyone." 
ON public.party_attendees 
FOR SELECT 
TO authenticated, anon 
USING ( true );

CREATE POLICY "Users can join parties." 
ON public.party_attendees 
FOR INSERT 
TO authenticated 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can update their attendance status." 
ON public.party_attendees 
FOR UPDATE 
TO authenticated 
USING ( (select auth.uid()) = user_id ) 
WITH CHECK ( (select auth.uid()) = user_id );

CREATE POLICY "Users can leave parties." 
ON public.party_attendees 
FOR DELETE 
TO authenticated 
USING ( (select auth.uid()) = user_id );
