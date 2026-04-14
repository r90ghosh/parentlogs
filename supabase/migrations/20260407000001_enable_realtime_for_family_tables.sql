-- Critical fix C1: Re-enable realtime sync for partner-shared tables.
-- The supabase_realtime publication had no tables in it, so the frontend
-- useRealtimeSync() hook was opening channels but never receiving events.
-- This silently broke the entire "shared family workspace" experience —
-- partners could not see each other's task completions, baby logs, or
-- checklist updates in real time.

ALTER PUBLICATION supabase_realtime ADD TABLE public.family_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.baby_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.checklist_progress;

-- REPLICA IDENTITY FULL ensures DELETE and UPDATE events include the full
-- old row, so the frontend can correctly identify which row changed.
ALTER TABLE public.family_tasks REPLICA IDENTITY FULL;
ALTER TABLE public.baby_logs REPLICA IDENTITY FULL;
ALTER TABLE public.checklist_progress REPLICA IDENTITY FULL;
