import React, { useState } from 'react';
import { format } from 'date-fns';
import { Task, Priority } from '../types/task';
import { SubtaskItem } from './SubtaskItem';
import { TaskMenu } from './TaskMenu';
import { Clock, ChevronDown, ChevronUp, Star, Bell } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onToggleStarred: () => void;
  onEdit: () => void;
  onAddSubtasks: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-destructive/20 text-destructive dark:bg-destructive/30'
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onToggleSubtask,
  onToggleStarred,
  onEdit,
  onAddSubtasks,
  onDuplicate,
  onDelete
}) => {
  const [subtasksExpanded, setSubtasksExpanded] = useState(false);
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const hasSubtasks = totalSubtasks > 0;

  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm transition-opacity ${task.completed ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={onToggleComplete}
            className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-muted-foreground/40 flex items-center justify-center transition-all hover:border-primary hover:scale-105"
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && (
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <h4 className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h4>
              
              {/* Star Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStarred();
                }}
                className="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
                aria-label={task.starred ? "Unstar task" : "Star task"}
              >
                <Star
                  className={`w-5 h-5 ${task.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                />
              </button>

              {/* Mark Symbol */}
              {task.mark && task.mark.type !== 'none' && task.mark.value && (
                <span className="text-xl flex-shrink-0">{task.mark.value}</span>
              )}
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {task.time && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{task.time}</span>
                </div>
              )}
              
              {/* Reminder Indicator */}
              {task.reminder && task.reminder.type !== 'none' && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="text-xs">{task.reminder.type}</span>
                </div>
              )}
              
              <span className={`px-2.5 py-0.5 rounded-full text-xs ${priorityColors[task.priority]}`}>
                {priorityLabels[task.priority]}
              </span>
              
              {task.category && (
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                  {task.category}
                </span>
              )}
            </div>

            {/* Subtasks */}
            {hasSubtasks && (
              <div className="mt-3">
                <button
                  onClick={() => setSubtasksExpanded(!subtasksExpanded)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                  {subtasksExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <span>
                    {completedSubtasks === totalSubtasks && totalSubtasks > 0
                      ? 'All subtasks completed'
                      : `${completedSubtasks} / ${totalSubtasks} subtasks completed`}
                  </span>
                </button>

                {subtasksExpanded && (
                  <div className="mt-2 pl-3 border-l-2 border-muted space-y-1">
                    {task.subtasks.map(subtask => (
                      <SubtaskItem
                        key={subtask.id}
                        id={subtask.id}
                        title={subtask.title}
                        completed={subtask.completed}
                        onToggle={() => onToggleSubtask(subtask.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Three-dot menu */}
          <TaskMenu
            onEdit={onEdit}
            onAddSubtasks={onAddSubtasks}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};