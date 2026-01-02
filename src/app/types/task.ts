export type Priority = 'low' | 'medium' | 'high';

export type ReminderType = 'none' | 'before' | 'onTime' | 'after';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type MarkType = 'flag' | 'number' | 'progress' | 'mood' | 'none';

export interface Reminder {
  type: ReminderType;
  offsetMinutes: number | null;
  repeat: RepeatType;
}

export interface Mark {
  type: MarkType;
  value: string | null;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  time?: string;
  priority: Priority;
  category: string;
  completed: boolean;
  starred: boolean;
  reminder: Reminder;
  mark: Mark;
  subtasks: Subtask[];
  createdAt: number;
  updatedAt: number;
}

export type FilterType = 'all' | 'pending' | 'completed' | 'high-priority' | 'starred';