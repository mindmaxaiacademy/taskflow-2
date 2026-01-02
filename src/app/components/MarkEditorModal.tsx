import React, { useState, useEffect } from 'react';
import { Mark } from '../types/task';
import { MarkSelector } from './MarkSelector';
import { X } from 'lucide-react';

interface MarkEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMark: Mark;
  onSave: (mark: Mark) => void;
  taskTitle: string;
}

export const MarkEditorModal: React.FC<MarkEditorModalProps> = ({
  isOpen,
  onClose,
  currentMark,
  onSave,
  taskTitle
}) => {
  const [mark, setMark] = useState<Mark>(currentMark);

  useEffect(() => {
    if (isOpen) {
      setMark(currentMark);
    }
  }, [isOpen, currentMark]);

  const handleSave = () => {
    onSave(mark);
    onClose();
  };

  const handleClear = () => {
    const clearedMark: Mark = { type: 'none', value: null };
    onSave(clearedMark);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-screen-sm mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h2 className="mb-1">Edit Mark / Flag</h2>
                <p className="text-sm text-muted-foreground line-clamp-1">{taskTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mark Selector */}
            <MarkSelector
              value={mark}
              onChange={setMark}
            />

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClear}
                className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors"
              >
                Clear Mark
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
