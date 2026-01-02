import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Task } from '../types/task';
import { Star } from 'lucide-react';

interface StarredScreenProps {
  onEditTask: (task: Task) => void;
  onAddSubtasks: (task: Task) => void;
}

export const StarredScreen: React.FC<StarredScreenProps> = ({ onEditTask, onAddSubtasks }) => {
  const { tasks, toggleTaskComplete, toggleSubtaskComplete, toggleTaskStarred, duplicateTask, deleteTask } = useTasks();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Filter starred tasks
  const starredTasks = tasks.filter(task => task.starred);
  const pendingStarredTasks = starredTasks.filter(t => !t.completed);
  const completedStarredTasks = starredTasks.filter(t => t.completed);

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />
            <h2>Starred Tasks</h2>
          </div>
          <p className="text-muted-foreground">
            Important tasks you've marked with a star
          </p>
        </div>

        {starredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="mb-2 text-muted-foreground">No starred tasks</h3>
            <p className="text-sm text-muted-foreground">
              Tap the star icon on any task to mark it as important
            </p>
          </div>
        ) : (
          <>
            {/* Pending Starred Tasks */}
            {pendingStarredTasks.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-muted-foreground">
                  Active ({pendingStarredTasks.length})
                </h3>
                <div className="space-y-3">
                  {pendingStarredTasks.map((task) => (
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

            {/* Completed Starred Tasks */}
            {completedStarredTasks.length > 0 && (
              <div>
                <h3 className="mb-4 text-muted-foreground">
                  Completed ({completedStarredTasks.length})
                </h3>
                <div className="space-y-3">
                  {completedStarredTasks.map((task) => (
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={taskToDelete !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
