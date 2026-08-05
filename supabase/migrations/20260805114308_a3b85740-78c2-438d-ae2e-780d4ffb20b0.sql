-- 1. Profiles: authenticated-only reads
DROP POLICY IF EXISTS "profiles readable" ON public.profiles;
CREATE POLICY "profiles readable by authenticated"
ON public.profiles FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.profiles FROM anon;

-- 2. user_roles: own role only
DROP POLICY IF EXISTS "roles readable by authenticated" ON public.user_roles;
CREATE POLICY "own role readable"
ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 3. Replace has_role() usage in policies with inline checks, then lock the function down
DROP POLICY IF EXISTS "conversation participants read" ON public.conversations;
CREATE POLICY "conversation participants read"
ON public.conversations FOR SELECT TO authenticated
USING (
  auth.uid() = member_id
  OR auth.uid() = coach_id
  OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'coach')
);

DROP POLICY IF EXISTS "participants update conversation" ON public.conversations;
CREATE POLICY "participants update conversation"
ON public.conversations FOR UPDATE TO authenticated
USING (
  auth.uid() = member_id
  OR auth.uid() = coach_id
  OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'coach')
);

DROP POLICY IF EXISTS "messages participants read" ON public.messages;
CREATE POLICY "messages participants read"
ON public.messages FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.conversations c
  WHERE c.id = messages.conversation_id
    AND (c.member_id = auth.uid() OR c.coach_id = auth.uid()
      OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'coach'))
));

DROP POLICY IF EXISTS "messages participants insert" ON public.messages;
CREATE POLICY "messages participants insert"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (c.member_id = auth.uid() OR c.coach_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'coach'))
  )
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;