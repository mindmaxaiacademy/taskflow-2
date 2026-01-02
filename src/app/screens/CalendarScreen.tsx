import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Task } from '../types/task';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarScreenProps {
  onEditTask: (task: Task) => void;
  onAddSubtasks: (task: Task) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onEditTask, onAddSubtasks }) => {
  const { tasks, toggleTaskComplete, toggleSubtaskComplete, toggleTaskStarred, duplicateTask, deleteTask } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      try {
        return isSameDay(parseISO(task.dueDate), date);
      } catch {
        return false;
      }
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const pendingSelectedTasks = selectedDateTasks.filter(t => !t.completed);
  const completedSelectedTasks = selectedDateTasks.filter(t => t.completed);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  // Get first day of week offset
  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {daysInMonth.map(date => {
              const tasksForDay = getTasksForDate(date);
              const hasTasksForDay = tasksForDay.length > 0;
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-colors relative ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : isTodayDate
                      ? 'bg-accent ring-2 ring-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  <span className="text-sm">{format(date, 'd')}</span>
                  {hasTasksForDay && (
                    <div className="flex gap-1 mt-1">
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        {selectedDate && (
          <div>
            <h3 className="mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>

            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks for this date.
              </div>
            ) : (
              <>
                {/* Pending Tasks */}
                {pendingSelectedTasks.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-muted-foreground">
                      Pending ({pendingSelectedTasks.length})
                    </h4>
                    <div className="space-y-3">
                      {pendingSelectedTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={() => toggleTaskComplete(task.id)}
                          onToggleSubtask={(subtaskId) => toggleSubtaskComplete(task.id, subtaskId)}
                          onToggleStarred={() => toggleTaskStarred(task.id)}
                          onEdit={() => onEditTask(task)}
                          onAddSubtasks={() => onAddSubtasks(task)}
                          onDuplicate={() => duplicateTask(task.id)}
                          onDelete={() => setTaskToDelete(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Tasks */}
                {completedSelectedTasks.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-muted-foreground">
                      Completed ({completedSelectedTasks.length})
                    </h4>
                    <div className="space-y-3">
                      {completedSelectedTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={() => toggleTaskComplete(task.id)}
                          onToggleSubtask={(subtaskId) => toggleSubtaskComplete(task.id, subtaskId)}
                          onToggleStarred={() => toggleTaskStarred(task.id)}
                          onEdit={() => onEditTask(task)}
                          onAddSubtasks={() => onAddSubtasks(task)}
                          onDuplicate={() => duplicateTask(task.id)}
                          onDelete={() => setTaskToDelete(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={taskToDelete !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};