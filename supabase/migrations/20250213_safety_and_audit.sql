-- ═══════════════════════════════════════════════════════════════════════════════════════
-- KING SOCIAL ZENITH - SAFETY & AUDIT v1.3
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- 1. REPORTS & MODERATION
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.users(id),
    reported_user_id UUID NOT NULL REFERENCES public.users(id),
    reason TEXT NOT NULL,
    description TEXT,
    content_reference_id UUID, -- Optional (e.g. message_id)
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewed','resolved')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. AUDIT LOG (The Ledger)
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.users(id),
    target_user_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL, -- 'ban', 'suspend', 'warn', 'delete_data'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RATE LIMITING
CREATE TABLE IF NOT EXISTS public.rate_limits (
    user_id UUID NOT NULL REFERENCES public.users(id),
    action TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    last_action_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, action)
);

-- SECURITY FUNCTIONS
CREATE OR REPLACE FUNCTION public.fn_is_friend(user_a UUID, user_b UUID)
RETURNS BOOLEAN AS $$
  -- In v0, we assume match = friend logic for social features
  SELECT public.fn_is_match(user_a, user_b);
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS for Reports (Reporter can see their own, Admins see all)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_reporter_policy ON public.reports FOR SELECT
USING (reporter_id = auth.uid());

-- RLS for Audit Log (Admins ONLY)
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_admin_policy ON public.audit_log FOR SELECT
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
