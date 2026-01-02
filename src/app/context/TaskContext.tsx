import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types/task';
import { 
  loadTasks, 
  saveTasks, 
  addTask as addTaskToStorage, 
  updateTask as updateTaskInStorage,
  deleteTask as deleteTaskFromStorage,
  duplicateTask as duplicateTaskInStorage,
  loadSettings,
  saveSettings,
  clearCompletedTasks as clearCompletedFromStorage,
  AppSettings
} from '../utils/storage';
import { MobileNotificationService } from '../services/MobileNotificationService';

interface TaskContextType {
  tasks: Task[];
  settings: AppSettings;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  toggleTaskStarred: (taskId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  clearCompletedTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ theme: 'light', autoCompleteParent: false });

  // Load initial data
  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedSettings = loadSettings();
    setTasks(loadedTasks);
    setSettings(loadedSettings);
    
    // Apply theme
    if (loadedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Schedule notifications for all tasks
    MobileNotificationService.rescheduleAllNotifications(loadedTasks);
  }, []);

  const addTask = (task: Task) => {
    const updated = addTaskToStorage(task);
    setTasks(updated);
    
    // Schedule notification for new task
    MobileNotificationService.scheduleNotification(task);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updated = updateTaskInStorage(taskId, updates);
    setTasks(updated);
    
    // Reschedule notification for updated task
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
      MobileNotificationService.cancelNotification(taskId);
      MobileNotificationService.scheduleNotification(updatedTask);
    }
  };

  const deleteTask = (taskId: string) => {
    const updated = deleteTaskFromStorage(taskId);
    setTasks(updated);
    
    // Cancel notification for deleted task
    MobileNotificationService.cancelNotification(taskId);
  };

  const duplicateTask = (taskId: string) => {
    const updated = duplicateTaskInStorage(taskId);
    setTasks(updated);
    
    // Schedule notification for duplicated task (if it has one)
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      MobileNotificationService.scheduleNotification(task);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    
    // If completing task, mark all subtasks as completed
    const updatedSubtasks = newCompleted 
      ? task.subtasks.map(st => ({ ...st, completed: true }))
      : task.subtasks; // Keep subtasks unchanged when uncompleting

    const updated = updateTaskInStorage(taskId, { 
      completed: newCompleted,
      subtasks: updatedSubtasks
    });
    setTasks(updated);
    
    // Cancel notification if task is completed, reschedule if uncompleted
    if (newCompleted) {
      MobileNotificationService.cancelNotification(taskId);
    } else {
      const updatedTask = updated.find(t => t.id === taskId);
      if (updatedTask) {
        MobileNotificationService.scheduleNotification(updatedTask);
      }
    }
  };

  const toggleSubtaskComplete = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    // Check if all subtasks are completed
    const allSubtasksCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
    
    // Auto-complete parent if setting is enabled
    const shouldCompleteParent = settings.autoCompleteParent && allSubtasksCompleted && !task.completed;

    const updated = updateTaskInStorage(taskId, { 
      subtasks: updatedSubtasks,
      ...(shouldCompleteParent ? { completed: true } : {})
    });
    setTasks(updated);
    
    // Cancel notification if parent task was auto-completed
    if (shouldCompleteParent) {
      MobileNotificationService.cancelNotification(taskId);
    }
  };

  const toggleTaskStarred = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updated = updateTaskInStorage(taskId, { 
      starred: !task.starred
    });
    setTasks(updated);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
    
    // Apply theme immediately
    if (newSettings.theme) {
      if (newSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const clearCompletedTasks = () => {
    const updated = clearCompletedFromStorage();
    setTasks(updated);
    
    // Notifications for completed tasks are already cancelled
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        settings,
        addTask,
        updateTask,
        deleteTask,
        duplicateTask,
        toggleTaskComplete,
        toggleSubtaskComplete,
        toggleTaskStarred,
        updateSettings,
        clearCompletedTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};