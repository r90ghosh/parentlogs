import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Plus, Search, CalendarDays, LayoutList } from 'lucide-react-native'
import { TaskCalendar } from '@/components/tasks/TaskCalendar'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTasks, useCompleteTask, useSnoozeTask } from '@/hooks/use-tasks'
import { CardEntrance, StaggerList } from '@/components/animations'
import {
  TaskItem,
  TaskStatsRow,
  TaskFilterTabs,
  TaskSectionHeader,
} from '@/components/tasks'
import { WeekNavPills } from '@/components/briefing'
import type { StatFilter } from '@/components/tasks'
import type { TaskTab } from '@/components/tasks'
import {
  groupTasksByTimePeriod,
} from '@tdc/shared/utils/task-timeline'
import type { TaskStats } from '@tdc/shared/types'
import {
  isToday,
  isPast,
  startOfDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
} from 'date-fns'

export default function TasksScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { family, profile } = useAuth()
  const [activeTab, setActiveTab] = useState<TaskTab>('active')
  const [statFilter, setStatFilter] = useState<StatFilter | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { data: tasks, isLoading, isRefetching } = useTasks()
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()

  // Current week from family
  const currentWeek = (family as { current_week?: number })?.current_week ?? 1
  const maxWeek = 104

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }, [queryClient])

  // Determine user role for partner filtering
  const userRole = profile?.role ?? 'dad'
  const partnerRole = userRole === 'dad' ? 'mom' : 'dad'

  // Compute task stats
  const allTasks = tasks ?? []

  // Task count per week
  const taskCountByWeek = useMemo(() => {
    const counts: Record<number, number> = {}
    const pending = allTasks.filter(t => t.status === 'pending' && !t.is_backlog)
    pending.forEach(t => {
      const week = t.week_due
      if (week != null) counts[week] = (counts[week] || 0) + 1
    })
    return counts
  }, [allTasks])
  const stats: TaskStats = useMemo(() => {
    const today = startOfDay(new Date())
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

    const pending = allTasks.filter(
      (t) => t.status === 'pending' || t.status === 'snoozed'
    )

    return {
      dueToday: pending.filter((t) => isToday(new Date(t.due_date))).length,
      thisWeek: pending.filter((t) => {
        const d = new Date(t.due_date)
        return d >= weekStart && d <= weekEnd
      }).length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      partnerTasks: pending.filter(
        (t) => t.assigned_to === partnerRole
      ).length,
      catchUpQueue: pending.filter((t) => {
        const d = new Date(t.due_date)
        return isPast(d) && !isToday(d)
      }).length,
    }
  }, [allTasks, partnerRole])

  // When a stat card is tapped, override tab + clear timeline
  const handleStatFilter = useCallback((filter: StatFilter | null) => {
    setStatFilter(filter)
    if (filter) {
      // Map stat filter to the matching tab
      const tabMap: Record<StatFilter, TaskTab> = {
        'due-today': 'active',
        'this-week': 'active',
        completed: 'completed',
        partner: 'partner',
        'catch-up': 'catch-up',
      }
      setActiveTab(tabMap[filter])
      setSelectedWeek(null)
    }
  }, [])

  // When a tab is tapped, clear stat filter
  const handleTabChange = useCallback((tab: TaskTab) => {
    setActiveTab(tab)
    setStatFilter(null)
    setSelectedWeek(null)
  }, [])

  // Filter tasks based on active tab, stat filter, and timeline
  const filteredTasks = useMemo(() => {
    let result = [...allTasks]
    const today = startOfDay(new Date())
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
    const comingUpEnd = addWeeks(today, 4)

    // Step 1: Filter by tab
    switch (activeTab) {
      case 'active':
        result = result.filter(
          (t) => t.status === 'pending' || t.status === 'snoozed'
        )
        break
      case 'my-tasks':
        result = result.filter(
          (t) =>
            (t.status === 'pending' || t.status === 'snoozed') &&
            (t.assigned_to === userRole ||
              t.assigned_to === 'both' ||
              t.assigned_to === 'either')
        )
        break
      case 'partner':
        result = result.filter(
          (t) =>
            (t.status === 'pending' || t.status === 'snoozed') &&
            (t.assigned_to === partnerRole || t.assigned_to === 'both')
        )
        break
      case 'completed':
        result = result.filter((t) => t.status === 'completed')
        break
      case 'catch-up':
        result = result.filter((t) => {
          const d = new Date(t.due_date)
          return (
            (t.status === 'pending' || t.status === 'snoozed') &&
            isPast(d) &&
            !isToday(d)
          )
        })
        break
    }

    // Step 2: Apply stat filter refinement (narrower than tab)
    if (statFilter === 'due-today') {
      result = result.filter((t) => isToday(new Date(t.due_date)))
    } else if (statFilter === 'this-week') {
      result = result.filter((t) => {
        const d = new Date(t.due_date)
        return d >= today && d <= weekEnd
      })
    }

    // Step 3: Apply week filter
    if (selectedWeek !== null) {
      result = result.filter((task) => task.week_due === selectedWeek)
    }

    // Step 4: Apply search filter
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase().trim()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term)
      )
    }

    return result
  }, [allTasks, activeTab, statFilter, selectedWeek, userRole, partnerRole, debouncedSearch])

  // Group tasks by time period for the default active view
  const showGroupedView =
    activeTab === 'active' && selectedWeek === null && !statFilter
  const groups = useMemo(() => {
    if (!showGroupedView) return null
    return groupTasksByTimePeriod(filteredTasks)
  }, [filteredTasks, showGroupedView])

  // For "Coming Up" section — limit to 5 tasks with a max 4 week window
  const comingUpTasks = useMemo(() => {
    if (!groups) return []
    const cutoff = addWeeks(new Date(), 4)
    return groups.future
      .filter((t) => new Date(t.due_date) <= cutoff)
      .slice(0, 5)
  }, [groups])

  const handleComplete = useCallback(
    (id: string) => completeTask.mutate(id),
    [completeTask]
  )

  const handleSnooze = useCallback(
    (id: string) => snoozeTask.mutate({ id }),
    [snoozeTask]
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Sticky header area */}
      <View style={[styles.headerArea, { paddingTop: 12 }]}>
        <View style={styles.pageTitleRow}>
          <Text style={styles.pageTitle}>Tasks</Text>
          <Pressable
            onPress={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            style={styles.viewToggleButton}
          >
            {viewMode === 'list' ? (
              <CalendarDays size={20} color="#7a6f62" />
            ) : (
              <LayoutList size={20} color="#c4703f" />
            )}
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={16} color="#7a6f62" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor="#4a4239"
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Stats Row */}
        <TaskStatsRow
          stats={stats}
          activeFilter={statFilter}
          onFilterPress={handleStatFilter}
        />

        {/* Filter Tabs */}
        <View style={styles.filterTabsWrap}>
          <TaskFilterTabs
            activeTab={activeTab}
            onTabPress={handleTabChange}
            catchUpCount={stats.catchUpQueue}
          />
        </View>

        {/* Week pills bar */}
        <WeekNavPills
          currentWeek={currentWeek}
          selectedWeek={selectedWeek}
          maxWeek={maxWeek}
          onSelect={(week) => setSelectedWeek(selectedWeek === week ? null : week)}
          taskCountByWeek={taskCountByWeek}
          showPhaseLabels
          showHeader
          onClearSelection={() => setSelectedWeek(null)}
        />
      </View>

      {/* Task content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c4703f" />
        </View>
      ) : viewMode === 'calendar' ? (
        <TaskCalendar
          tasks={allTasks.filter((t) => t.status === 'pending' || t.status === 'snoozed')}
          onComplete={handleComplete}
          onSnooze={handleSnooze}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor="#c4703f"
              colors={['#c4703f']}
            />
          }
        >
          {showGroupedView && groups ? (
            /* Grouped view: Due Today / This Week / Coming Up */
            <>
              {/* Due Today */}
              {groups.current.filter((t) =>
                isToday(new Date(t.due_date))
              ).length > 0 && (
                <CardEntrance delay={0}>
                  <View style={styles.section}>
                    <TaskSectionHeader
                      title="Due Today"
                      count={
                        groups.current.filter((t) =>
                          isToday(new Date(t.due_date))
                        ).length
                      }
                      accentColor="#c4703f"
                    />
                    <StaggerList staggerMs={60}>
                      {groups.current
                        .filter((t) => isToday(new Date(t.due_date)))
                        .map((task) => (
                          <View key={task.id} style={styles.taskItemWrapper}>
                            <TaskItem
                              task={task}
                              onComplete={handleComplete}
                              onSnooze={handleSnooze}
                            />
                          </View>
                        ))}
                    </StaggerList>
                  </View>
                </CardEntrance>
              )}

              {/* Catch Up (past due) */}
              {groups.previous.length > 0 && (
                <CardEntrance delay={80}>
                  <View style={styles.section}>
                    <TaskSectionHeader
                      title="Catch Up"
                      count={groups.previous.length}
                      accentColor="#d4a853"
                    />
                    <StaggerList staggerMs={60}>
                      {groups.previous.map((task) => (
                        <View key={task.id} style={styles.taskItemWrapper}>
                          <TaskItem
                            task={task}
                            onComplete={handleComplete}
                            onSnooze={handleSnooze}
                          />
                        </View>
                      ))}
                    </StaggerList>
                  </View>
                </CardEntrance>
              )}

              {/* This Week (excluding today's tasks already shown above) */}
              {groups.current.filter(
                (t) => !isToday(new Date(t.due_date))
              ).length > 0 && (
                <CardEntrance delay={160}>
                  <View style={styles.section}>
                    <TaskSectionHeader
                      title="This Week"
                      count={
                        groups.current.filter(
                          (t) => !isToday(new Date(t.due_date))
                        ).length
                      }
                    />
                    <StaggerList staggerMs={60}>
                      {groups.current
                        .filter((t) => !isToday(new Date(t.due_date)))
                        .map((task) => (
                          <View key={task.id} style={styles.taskItemWrapper}>
                            <TaskItem
                              task={task}
                              onComplete={handleComplete}
                              onSnooze={handleSnooze}
                            />
                          </View>
                        ))}
                    </StaggerList>
                  </View>
                </CardEntrance>
              )}

              {/* Coming Up */}
              {comingUpTasks.length > 0 && (
                <CardEntrance delay={240}>
                  <View style={styles.section}>
                    <TaskSectionHeader
                      title="Coming Up"
                      count={comingUpTasks.length}
                      accentColor="#7a6f62"
                      dimmed
                    />
                    <StaggerList staggerMs={60}>
                      {comingUpTasks.map((task) => (
                        <View key={task.id} style={styles.taskItemWrapper}>
                          <TaskItem
                            task={task}
                            onComplete={handleComplete}
                            onSnooze={handleSnooze}
                          />
                        </View>
                      ))}
                    </StaggerList>
                    {groups.future.length > 5 && (
                      <Text style={styles.moreText}>
                        +{groups.future.length - 5} more tasks ahead
                      </Text>
                    )}
                  </View>
                </CardEntrance>
              )}
            </>
          ) : (
            /* Flat list view: filtered/tab/timeline results */
            <>
              {filteredTasks.length > 0 ? (
                <View style={styles.section}>
                  {debouncedSearch.trim() ? (
                    <Text style={styles.searchResultCount}>
                      {`${filteredTasks.length} result${filteredTasks.length !== 1 ? 's' : ''} for '${debouncedSearch.trim()}'`}
                    </Text>
                  ) : (
                    <TaskSectionHeader
                      title={getSectionTitle(activeTab, statFilter, selectedWeek)}
                      count={filteredTasks.length}
                      accentColor={getSectionColor(activeTab, statFilter)}
                    />
                  )}
                  <StaggerList staggerMs={50}>
                    {filteredTasks.map((task) => (
                      <View key={task.id} style={styles.taskItemWrapper}>
                        <TaskItem
                          task={task}
                          onComplete={handleComplete}
                          onSnooze={handleSnooze}
                        />
                      </View>
                    ))}
                  </StaggerList>
                </View>
              ) : null}
            </>
          )}

          {/* Empty state */}
          {filteredTasks.length === 0 && !showGroupedView && (
            <CardEntrance delay={100}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>
                  {activeTab === 'completed' ? '🏆' : '🎉'}
                </Text>
                <Text style={styles.emptyTitle}>
                  {activeTab === 'completed'
                    ? 'No completed tasks yet'
                    : 'All caught up'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {activeTab === 'completed'
                    ? 'Complete your first task to see it here.'
                    : selectedWeek !== null
                      ? `No tasks for Week ${selectedWeek}. Try another week.`
                      : 'No tasks match your current filters.'}
                </Text>
              </View>
            </CardEntrance>
          )}

          {/* Empty state for grouped view when everything is empty */}
          {showGroupedView &&
            groups &&
            groups.previous.length === 0 &&
            groups.current.length === 0 &&
            groups.future.length === 0 && (
              <CardEntrance delay={100}>
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🎉</Text>
                  <Text style={styles.emptyTitle}>All caught up</Text>
                  <Text style={styles.emptySubtitle}>
                    No pending tasks right now. Check back soon.
                  </Text>
                </View>
              </CardEntrance>
            )}
        </ScrollView>
      )}

      {/* FAB - Create Task */}
      <Pressable
        onPress={() => router.push('/(screens)/create-task')}
        style={[styles.fab, { bottom: insets.bottom + 100 }]}
      >
        <Plus size={24} color="#faf6f0" />
      </Pressable>
    </View>
  )
}

function getSectionTitle(
  tab: TaskTab,
  statFilter: StatFilter | null,
  selectedWeek: number | null
): string {
  if (statFilter === 'due-today') return 'Due Today'
  if (statFilter === 'this-week') return 'This Week'

  if (selectedWeek !== null) {
    return `Week ${selectedWeek}`
  }

  switch (tab) {
    case 'active':
      return 'Active Tasks'
    case 'my-tasks':
      return 'My Tasks'
    case 'partner':
      return "Partner's Tasks"
    case 'completed':
      return 'Completed'
    case 'catch-up':
      return 'Catch-Up Queue'
    default:
      return 'Tasks'
  }
}

function getSectionColor(tab: TaskTab, statFilter: StatFilter | null): string {
  if (statFilter === 'due-today') return '#c4703f'
  if (statFilter === 'this-week') return '#5b9bd5'

  switch (tab) {
    case 'completed':
      return '#6b8f71'
    case 'catch-up':
      return '#d4a853'
    case 'partner':
      return '#c47a8f'
    default:
      return '#faf6f0'
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  headerArea: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
  },
  viewToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(237,230,220,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#ede6dc',
  },
  searchResultCount: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#7a6f62',
    marginBottom: 12,
  },
  filterTabsWrap: {
    marginTop: 14,
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 28,
  },
  taskItemWrapper: {
    marginBottom: 8,
  },
  moreText: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#c4703f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#c4703f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
})
