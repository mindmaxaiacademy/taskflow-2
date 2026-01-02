import React, { useState, useRef, useEffect } from 'react';
import { EllipsisVertical, Edit, Copy, Trash2, Plus } from 'lucide-react';

interface TaskMenuProps {
  onEdit: () => void;
  onAddSubtasks: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const TaskMenu: React.FC<TaskMenuProps> = ({ onEdit, onAddSubtasks, onDuplicate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-accent rounded-lg transition-colors"
        aria-label="Task options"
      >
        <EllipsisVertical className="w-5 h-5 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
            <span>Edit Task</span>
          </button>
          
          <button
            onClick={() => {
              onAddSubtasks();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
            <span>Add/Edit Subtasks</span>
          </button>
          
          <button
            onClick={() => {
              onDuplicate();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
            <span>Duplicate Task</span>
          </button>
          
          <div className="h-px bg-border" />
          
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 transition-colors text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>
        </div>
      )}
    </div>
  );
};