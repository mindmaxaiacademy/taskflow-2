import React, { useState } from 'react';
import { Reminder, ReminderType, RepeatType } from '../types/task';
import { Bell, ChevronDown, X } from 'lucide-react';

interface ReminderPickerProps {
  value: Reminder;
  onChange: (reminder: Reminder) => void;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const reminderOptions = [
    { label: 'No reminder', type: 'none' as ReminderType, offset: null },
    { label: 'On time', type: 'onTime' as ReminderType, offset: 0 },
    { label: '5 minutes before', type: 'before' as ReminderType, offset: 5 },
    { label: '10 minutes before', type: 'before' as ReminderType, offset: 10 },
    { label: '15 minutes before', type: 'before' as ReminderType, offset: 15 },
    { label: '30 minutes before', type: 'before' as ReminderType, offset: 30 },
    { label: '1 hour before', type: 'before' as ReminderType, offset: 60 },
    { label: '5 minutes after', type: 'after' as ReminderType, offset: 5 },
    { label: '10 minutes after', type: 'after' as ReminderType, offset: 10 },
    { label: '30 minutes after', type: 'after' as ReminderType, offset: 30 },
  ];

  const repeatOptions = [
    { label: 'Does not repeat', value: 'none' as RepeatType },
    { label: 'Daily', value: 'daily' as RepeatType },
    { label: 'Weekly', value: 'weekly' as RepeatType },
    { label: 'Monthly', value: 'monthly' as RepeatType },
    { label: 'Yearly', value: 'yearly' as RepeatType },
  ];

  const getCurrentReminderLabel = () => {
    if (value.type === 'none') return 'No reminder';
    if (value.type === 'onTime') return 'On time';
    
    const option = reminderOptions.find(
      opt => opt.type === value.type && opt.offset === value.offsetMinutes
    );
    return option?.label || 'Custom reminder';
  };

  const handleReminderSelect = (type: ReminderType, offset: number | null) => {
    onChange({
      ...value,
      type,
      offsetMinutes: offset
    });
  };

  const handleRepeatSelect = (repeat: RepeatType) => {
    onChange({
      ...value,
      repeat
    });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Reminder</label>
      
      {/* Reminder Type Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-left flex items-center justify-between hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span>{getCurrentReminderLabel()}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {reminderOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    handleReminderSelect(option.type, option.offset);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-accent transition-colors ${
                    value.type === option.type && value.offsetMinutes === option.offset
                      ? 'bg-accent'
                      : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Repeat Selector - only show if reminder is set */}
      {value.type !== 'none' && (
        <div>
          <label className="block text-sm font-medium mb-2">Repeat</label>
          <div className="grid grid-cols-2 gap-2">
            {repeatOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleRepeatSelect(option.value)}
                className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                  value.repeat === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
