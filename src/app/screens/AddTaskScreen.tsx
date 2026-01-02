import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { Task, Priority, Subtask, Reminder, Mark } from '../types/task';
import { X, Plus, Trash2 } from 'lucide-react';
import { DateTimePicker } from '../components/DateTimePicker';
import { ReminderPicker } from '../components/ReminderPicker';
import { MarkSelector } from '../components/MarkSelector';

interface AddTaskScreenProps {
  isOpen: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

export const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ isOpen, onClose, editTask }) => {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [reminder, setReminder] = useState<Reminder>({ type: 'none', offsetMinutes: null, repeat: 'none' });
  const [mark, setMark] = useState<Mark>({ type: 'none', value: null });

  // Load edit task data
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setDueDate(editTask.dueDate);
      setTime(editTask.time || '');
      setPriority(editTask.priority);
      setCategory(editTask.category);
      setSubtasks(editTask.subtasks);
      setReminder(editTask.reminder);
      setMark(editTask.mark);
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate(format(new Date(), 'yyyy-MM-dd'));
      setTime('');
      setPriority('medium');
      setCategory('');
      setSubtasks([]);
      setNewSubtaskTitle('');
      setReminder({ type: 'none', offsetMinutes: null, repeat: 'none' });
      setMark({ type: 'none', value: null });
    }
  }, [editTask, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) {
      alert('Please fill in the required fields: Title and Due Date');
      return;
    }

    if (editTask) {
      // Update existing task
      updateTask(editTask.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        time: time || undefined,
        priority,
        category: category.trim(),
        subtasks,
        reminder,
        mark
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        description: description.trim(),
        dueDate,
        time: time || undefined,
        priority,
        category: category.trim(),
        completed: false,
        starred: false,
        subtasks,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        reminder,
        mark
      };
      addTask(newTask);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="max-w-screen-sm mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2>{editTask ? 'Edit Task' : 'Add New Task'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-2">
              Task Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task description"
              rows={3}
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block mb-2">
                Due Date <span className="text-destructive">*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block mb-2">
                Time
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-3 px-4 rounded-xl capitalize transition-colors ${
                    priority === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block mb-2">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Work, Personal, Shopping"
              className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="block mb-2">Subtasks</label>
            
            {subtasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
                    <span className="flex-1">{subtask.title}</span>
                    <button
                      type="button"
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

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                placeholder="Add a subtask"
                className="flex-1 px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                aria-label="Add subtask"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reminder */}
          <ReminderPicker
            value={reminder}
            onChange={setReminder}
          />

          {/* Mark */}
          <MarkSelector
            value={mark}
            onChange={setMark}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            {editTask ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};