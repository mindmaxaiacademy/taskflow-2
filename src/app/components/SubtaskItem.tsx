import React from 'react';

interface SubtaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: () => void;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({ title, completed, onToggle }) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-5 h-5 rounded border-2 border-muted-foreground/40 flex items-center justify-center transition-colors hover:border-primary"
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {completed && (
          <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <span className={`flex-1 ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
        {title}
      </span>
    </div>
  );
};
