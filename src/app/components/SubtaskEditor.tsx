import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { Task, Subtask } from '../types/task';
import { X, Plus, Trash2 } from 'lucide-react';

interface SubtaskEditorProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const SubtaskEditor: React.FC<SubtaskEditorProps> = ({ isOpen, onClose, task }) => {
  const { updateTask } = useTasks();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (task) {
      setSubtasks([...task.subtasks]);
    }
  }, [task]);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: newSubtaskTitle.trim(),
        completed: false
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleSave = () => {
    if (task) {
      updateTask(task.id, { subtasks });
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="mb-1">Edit Subtasks</h3>
              <p className="text-sm text-muted-foreground">{task.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Existing Subtasks */}
            {subtasks.length > 0 && (
              <div className="space-y-2">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
                    <span className="flex-1">{subtask.title}</span>
                    <button
                      onClick={() => handleRemoveSubtask(subtask.id)}
                      className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors"
                      aria-label="Remove subtask"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Subtask */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                placeholder="Add a subtask"
                className="flex-1 px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddSubtask}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                aria-label="Add subtask"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
