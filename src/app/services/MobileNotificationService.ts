import { Task } from '../types/task';
import { LocalNotifications, ScheduleOptions, PendingResult } from '@capacitor/local-notifications';
import { parseISO, addMinutes, addDays, addWeeks, addMonths, addYears, isPast } from 'date-fns';

/**
 * Mobile Local Notification Service
 * Uses Capacitor Local Notifications for native device notifications
 * Works offline, persists when app is closed, no server required
 */
class MobileNotificationServiceClass {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  // ============ INITIALIZATION ============

  private async initialize() {
    try {
      // Request permission on first launch
      const permission = await LocalNotifications.requestPermissions();
      this.initialized = permission.display === 'granted';
      
      if (this.initialized) {
        console.log('✅ Local notifications enabled');
      } else {
        console.warn('⚠️  Local notifications permission denied');
      }

      // Listen for notification actions
      await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification tapped:', notification);
        // You can handle notification tap here (e.g., open specific task)
      });
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      this.initialized = false;
    }
  }

  // ============ PERMISSION MANAGEMENT ============

  async checkPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.checkPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.requestPermissions();
      this.initialized = result.display === 'granted';
      return this.initialized;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  // ============ NOTIFICATION SCHEDULING ============

  async scheduleNotification(task: Task): Promise<void> {
    if (!this.initialized) {
      console.warn('Notifications not initialized');
      return;
    }

    // Don't schedule if reminder is disabled
    if (task.reminder.type === 'none') {
      return;
    }

    // Don't schedule for completed tasks
    if (task.completed) {
      return;
    }

    // Must have due date and time
    if (!task.dueDate || !task.time) {
      return;
    }

    try {
      const notificationTime = this.calculateNotificationTime(task);
      
      if (!notificationTime) {
        console.warn('Could not calculate notification time for task:', task.title);
        return;
      }

      // Don't schedule past notifications
      if (isPast(notificationTime)) {
        console.log('Notification time has passed, skipping:', task.title);
        return;
      }

      // Cancel any existing notification for this task
      await this.cancelNotification(task.id);

      // Create notification ID from task ID
      const notificationId = this.getNotificationId(task.id);

      // Schedule the notification
      const scheduleOptions: ScheduleOptions = {
        notifications: [
          {
            id: notificationId,
            title: '⏰ Task Reminder',
            body: `${this.getPriorityIcon(task.priority)} ${task.title}`,
            schedule: {
              at: notificationTime
            },
            sound: 'default',
            attachments: undefined,
            actionTypeId: 'TASK_REMINDER',
            extra: {
              taskId: task.id,
              taskTitle: task.title
            }
          }
        ]
      };

      await LocalNotifications.schedule(scheduleOptions);
      
      console.log(`✅ Scheduled notification for "${task.title}" at ${notificationTime.toLocaleString()}`);

      // If task has repeat, schedule next occurrence
      if (task.reminder.repeat !== 'none') {
        await this.scheduleRepeatingNotification(task);
      }
    } catch (error) {
      console.error('Failed to schedule notification for task:', task.title, error);
    }
  }

  async scheduleRepeatingNotification(task: Task): Promise<void> {
    // This would create future occurrences based on repeat type
    // For simplicity, we schedule the next occurrence when notification fires
    // You can expand this to schedule multiple future occurrences
    console.log('Repeating notification setup for:', task.title, task.reminder.repeat);
  }

  async cancelNotification(taskId: string): Promise<void> {
    try {
      const notificationId = this.getNotificationId(taskId);
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
      console.log(`🗑️  Cancelled notification for task: ${taskId}`);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
        console.log(`🗑️  Cancelled ${pending.notifications.length} notifications`);
      }
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  async rescheduleAllNotifications(tasks: Task[]): Promise<void> {
    console.log('📅 Rescheduling all task notifications...');
    await this.cancelAllNotifications();
    
    for (const task of tasks) {
      await this.scheduleNotification(task);
    }
    
    console.log(`✅ Rescheduled notifications for ${tasks.length} tasks`);
  }

  // ============ UTILITY METHODS ============

  private calculateNotificationTime(task: Task): Date | null {
    try {
      // Parse the due date and time
      const dateTime = this.parseTaskDateTime(task);
      if (!dateTime) return null;

      // Calculate based on reminder type
      switch (task.reminder.type) {
        case 'onTime':
          return dateTime;
          
        case 'before':
          if (task.reminder.offsetMinutes) {
            return addMinutes(dateTime, -task.reminder.offsetMinutes);
          }
          return null;
          
        case 'after':
          if (task.reminder.offsetMinutes) {
            return addMinutes(dateTime, task.reminder.offsetMinutes);
          }
          return null;
          
        default:
          return null;
      }
    } catch (error) {
      console.error('Error calculating notification time:', error);
      return null;
    }
  }

  private parseTaskDateTime(task: Task): Date | null {
    try {
      if (!task.time) return null;

      const dateStr = task.dueDate;
      const timeStr = task.time;

      // Combine date and time
      const [hours, minutes] = timeStr.split(':').map(Number);
      const dateTime = parseISO(dateStr);
      dateTime.setHours(hours, minutes, 0, 0);

      return dateTime;
    } catch (error) {
      console.error('Error parsing task date/time:', error);
      return null;
    }
  }

  getNextOccurrenceDate(task: Task): Date | null {
    try {
      const currentDate = parseISO(task.dueDate);
      
      switch (task.reminder.repeat) {
        case 'daily':
          return addDays(currentDate, 1);
        case 'weekly':
          return addWeeks(currentDate, 1);
        case 'monthly':
          return addMonths(currentDate, 1);
        case 'yearly':
          return addYears(currentDate, 1);
        default:
          return null;
      }
    } catch (error) {
      console.error('Error calculating next occurrence:', error);
      return null;
    }
  }

  private getNotificationId(taskId: string): number {
    // Convert task ID string to a unique number ID
    // Use hash function to generate consistent numeric ID
    let hash = 0;
    for (let i = 0; i < taskId.length; i++) {
      const char = taskId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '📌';
    }
  }

  // ============ DEBUGGING ============

  async getPendingNotifications(): Promise<PendingResult> {
    try {
      return await LocalNotifications.getPending();
    } catch (error) {
      console.error('Failed to get pending notifications:', error);
      return { notifications: [] };
    }
  }

  async logPendingNotifications(): Promise<void> {
    const pending = await this.getPendingNotifications();
    console.log(`📊 Pending notifications: ${pending.notifications.length}`);
    pending.notifications.forEach(n => {
      console.log(`  - ID: ${n.id}, Title: ${n.title}`);
    });
  }
}

// Singleton instance
export const MobileNotificationService = new MobileNotificationServiceClass();
