import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { CheckCircle2, Circle, TrendingUp, Target } from 'lucide-react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO, isWithinInterval } from 'date-fns';

export const StatsScreen: React.FC = () => {
  const { tasks } = useTasks();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority breakdown
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;

    // This week's tasks
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyData = weekDays.map(day => {
      const dayTasks = tasks.filter(task => {
        try {
          const taskDate = parseISO(task.dueDate);
          return format(taskDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        } catch {
          return false;
        }
      });
      
      return {
        day: format(day, 'EEE'),
        completed: dayTasks.filter(t => t.completed).length,
        pending: dayTasks.filter(t => !t.completed).length
      };
    });

    return {
      total,
      completed,
      pending,
      completionRate,
      highPriority,
      mediumPriority,
      lowPriority,
      weeklyData
    };
  }, [tasks]);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="mb-6">Statistics</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl mb-1">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl mb-1">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl mb-1">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl mb-1">{stats.completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <h3 className="mb-4">Overall Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Completed</span>
                <span>{stats.completed} of {stats.total}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <h3 className="mb-4">Priority Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>High Priority</span>
              </div>
              <span className="text-muted-foreground">{stats.highPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Medium Priority</span>
              </div>
              <span className="text-muted-foreground">{stats.mediumPriority}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span>Low Priority</span>
              </div>
              <span className="text-muted-foreground">{stats.lowPriority}</span>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="mb-4">This Week</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {stats.weeklyData.map((day, index) => {
              const maxHeight = 120;
              const total = day.completed + day.pending;
              const maxTasks = Math.max(...stats.weeklyData.map(d => d.completed + d.pending), 1);
              const completedHeight = (day.completed / maxTasks) * maxHeight;
              const pendingHeight = (day.pending / maxTasks) * maxHeight;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex flex-col justify-end gap-1">
                    {day.completed > 0 && (
                      <div
                        className="w-full bg-gradient-to-t from-primary to-green-500 rounded-t"
                        style={{ height: `${completedHeight}px` }}
                      />
                    )}
                    {day.pending > 0 && (
                      <div
                        className="w-full bg-blue-500/30 rounded-t"
                        style={{ height: `${pendingHeight}px` }}
                      />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{day.day}</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-primary to-green-500" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500/30" />
              <span className="text-muted-foreground">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
