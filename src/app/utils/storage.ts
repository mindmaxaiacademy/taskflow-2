import { Task } from '../types/task';

const STORAGE_KEY = 'taskflow_tasks';
const SETTINGS_KEY = 'taskflow_settings';

export interface AppSettings {
  theme: 'light' | 'dark';
  autoCompleteParent: boolean;
}

// Task storage functions
export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const tasks = JSON.parse(data);
    
    // Migrate existing tasks to include new fields
    return tasks.map((task: any) => ({
      ...task,
      starred: task.starred ?? false,
      reminder: task.reminder ?? { type: 'none', offsetMinutes: null, repeat: 'none' },
      mark: task.mark ?? { type: 'none', value: null }
    }));
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const addTask = (task: Task): Task[] => {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
};

export const updateTask = (taskId: string, updates: Partial<Task>): Task[] => {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates, updatedAt: Date.now() };
    saveTasks(tasks);
  }
  return tasks;
};

export const deleteTask = (taskId: string): Task[] => {
  const tasks = loadTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  saveTasks(filtered);
  return filtered;
};

export const duplicateTask = (taskId: string): Task[] => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${task.title} (Copy)`,
      completed: false,
      subtasks: task.subtasks.map(st => ({ ...st, id: `subtask_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, completed: false })),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    tasks.push(newTask);
    saveTasks(tasks);
  }
  return tasks;
};

// Settings storage functions
export const loadSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { theme: 'light', autoCompleteParent: false };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return { theme: 'light', autoCompleteParent: false };
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const clearCompletedTasks = (): Task[] => {
  const tasks = loadTasks();
  const filtered = tasks.filter(t => !t.completed);
  saveTasks(filtered);
  return filtered;
};