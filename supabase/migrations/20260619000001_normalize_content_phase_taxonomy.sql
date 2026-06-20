-- Normalize content phase taxonomy across content tables.
--
-- Problem: the same time periods are described with four different vocabularies:
--   * briefing/task/budget/checklist  -> family_stage ('post-birth') + week  (derive via familyStageToContentPhase)
--   * dad_challenge_content.phase      -> canonical content_phase ('0-3-months' ...)  [already correct]
--   * articles.stage / videos.stage    -> outlier vocab ('fourth-trimester','18-24-months','delivery','cross-phase')
--
-- The articles/videos `stage` values are read by live code (web ArticleCard/VideoCard
-- colour maps, content.ts/blog.ts labels, mobile videos filter), so we do NOT rename them.
-- Instead this migration is ADDITIVE + non-breaking: it adds a canonical `content_phase`
-- column to articles and videos, backfilled from `stage`, leaving `stage` untouched.
-- After this, every content table can be queried by the single canonical content_phase.

-- 1. Add canonical column (nullable: NULL == applies to all phases, e.g. 'cross-phase')
alter table public.articles add column if not exists content_phase text;
alter table public.videos   add column if not exists content_phase text;

-- 2. Backfill articles.stage -> content_phase
update public.articles set content_phase = case stage
  when 'pre-pregnancy'    then 'pre-pregnancy'
  when 'first-trimester'  then 'trimester-1'
  when 'second-trimester' then 'trimester-2'
  when 'third-trimester'  then 'trimester-3'
  when 'delivery'         then 'trimester-3'
  when 'fourth-trimester' then '0-3-months'
  when '3-6-months'       then '3-6-months'
  when '6-12-months'      then '6-12-months'
  when '12-18-months'     then '12-18-months'
  when '18-24-months'     then '18-plus'
  else null
end
where content_phase is null;

-- 3. Backfill videos.stage -> content_phase (videos also have 'cross-phase' -> NULL = all)
update public.videos set content_phase = case stage
  when 'pre-pregnancy'    then 'pre-pregnancy'
  when 'first-trimester'  then 'trimester-1'
  when 'second-trimester' then 'trimester-2'
  when 'third-trimester'  then 'trimester-3'
  when 'delivery'         then 'trimester-3'
  when 'fourth-trimester' then '0-3-months'
  when '3-6-months'       then '3-6-months'
  when '6-12-months'      then '6-12-months'
  when '12-18-months'     then '12-18-months'
  when '18-24-months'     then '18-plus'
  when 'cross-phase'      then null
  else null
end
where content_phase is null;

-- 4. Guard rail: only canonical content_phase values (or NULL for cross-phase/global)
--    Matches dad_challenge_content.phase vocabulary.
alter table public.articles drop constraint if exists articles_content_phase_check;
alter table public.articles add constraint articles_content_phase_check
  check (content_phase is null or content_phase in (
    'pre-pregnancy','trimester-1','trimester-2','trimester-3',
    '0-3-months','3-6-months','6-12-months','12-18-months','18-plus'
  ));

alter table public.videos drop constraint if exists videos_content_phase_check;
alter table public.videos add constraint videos_content_phase_check
  check (content_phase is null or content_phase in (
    'pre-pregnancy','trimester-1','trimester-2','trimester-3',
    '0-3-months','3-6-months','6-12-months','12-18-months','18-plus'
  ));

-- 5. Indexes for phase-filtered reads
create index if not exists idx_articles_content_phase on public.articles(content_phase);
create index if not exists idx_videos_content_phase   on public.videos(content_phase);

-- Note: RLS is unchanged. Existing SELECT policies cover the new column.
-- Follow-up (separate PR): migrate web/mobile consumers from `stage` to `content_phase`,
-- then the outlier `stage` vocabulary can be deprecated.
