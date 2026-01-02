import React, { useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Task, FilterType } from '../types/task';
import { Filter } from 'lucide-react';

interface HomeScreenProps {
  onEditTask: (task: Task) => void;
  onAddSubtasks: (task: Task) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onEditTask, onAddSubtasks }) => {
  const { tasks, toggleTaskComplete, toggleSubtaskComplete, toggleTaskStarred, duplicateTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Filter tasks for today
  const todayTasks = tasks.filter(task => {
    try {
      return isToday(parseISO(task.dueDate));
    } catch {
      return false;
    }
  });

  // Apply additional filters
  const filteredTasks = todayTasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'high-priority':
        return task.priority === 'high';
      case 'starred':
        return task.starred;
      default:
        return true;
    }
  });

  // Separate completed and pending
  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'high-priority', label: 'High Priority' },
    { id: 'starred', label: 'Starred' },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Today</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task Lists */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {todayTasks.length === 0 
                ? "No tasks for today. Tap + to add one!"
                : "No tasks match this filter."}
            </p>
          </div>
        ) : (
          <>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-muted-foreground">
                  Pending ({pendingTasks.length})
                </h3>
                <div className="space-y-3">
                  {pendingTasks.map(task => (
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
            {completedTasks.length > 0 && (
              <div>
                <h3 className="mb-3 text-muted-foreground">
                  Completed ({completedTasks.length})
                </h3>
                <div className="space-y-3">
                  {completedTasks.map(task => (
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