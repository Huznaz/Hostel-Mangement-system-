-- =============================================================================
-- Grant admin access — EDIT the email below, then run once after you sign up
-- =============================================================================

insert into public.admin_users (id)
select id from auth.users
where email = 'odongojackton@students.uonbi.ac.ke'
on conflict (id) do nothing;

-- Verify:
-- select u.email, a.id from auth.users u
-- join public.admin_users a on a.id = u.id;
