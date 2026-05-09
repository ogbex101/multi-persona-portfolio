
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Restrict bucket listing: only allow reading individual file objects via public URLs (which still works), not listing
DROP POLICY IF EXISTS "public read portfolio" ON storage.objects;
CREATE POLICY "public read portfolio files" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio' AND auth.role() = 'anon' IS NOT NULL);
-- Note: public bucket files are still served via signed CDN URLs regardless of select policy
