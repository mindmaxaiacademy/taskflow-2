import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  parseISO,
  addMonths,
  subMonths
} from 'date-fns';
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateTimePickerProps {
  date: string; // ISO date
  time?: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  time = '',
  onDateChange,
  onTimeChange
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    try {
      return parseISO(date);
    } catch {
      return new Date();
    }
  });

  const selectedDate = parseISO(date);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const handleDateSelect = (day: Date) => {
    onDateChange(format(day, 'yyyy-MM-dd'));
    setShowCalendar(false);
  };

  const handleTimeChange = (newTime: string) => {
    onTimeChange(newTime);
    setShowTimePicker(false);
  };

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-medium mb-2">Due Date</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-left flex items-center justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
          </button>

          {showCalendar && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowCalendar(false)}
              />
              <div className="absolute z-50 mt-2 bg-card border border-border rounded-xl shadow-2xl p-4 w-full max-w-sm">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-accent rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-accent rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {emptyDays.map(i => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {daysInMonth.map(day => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : isTodayDate
                            ? 'bg-accent ring-2 ring-primary font-medium'
                            : 'hover:bg-accent'
                        }`}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Time Picker */}
      <div>
        <label className="block text-sm font-medium mb-2">Time (optional)</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-left flex items-center justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{time || 'No time set'}</span>
            </div>
            {time && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTimeChange('');
                }}
                className="p-1 hover:bg-destructive/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </button>

          {showTimePicker && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowTimePicker(false)}
              />
              <div className="absolute z-50 mt-2 bg-card border border-border rounded-xl shadow-2xl p-4 w-full">
                <TimePicker 
                  value={time}
                  onChange={handleTimeChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Time Picker Component
interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [hour, setHour] = useState(() => {
    if (!value) return 12;
    const [h] = value.split(':');
    const hourNum = parseInt(h);
    return hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  });
  
  const [minute, setMinute] = useState(() => {
    if (!value) return 0;
    const [, m] = value.split(':');
    return parseInt(m) || 0;
  });
  
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => {
    if (!value) return 'AM';
    const [h] = value.split(':');
    return parseInt(h) >= 12 ? 'PM' : 'AM';
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];

  const handleApply = () => {
    let finalHour = hour;
    if (period === 'PM' && hour !== 12) finalHour += 12;
    if (period === 'AM' && hour === 12) finalHour = 0;
    
    const timeString = `${finalHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(timeString);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* Hour Selector */}
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-2">Hour</label>
          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
            {hours.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setHour(h)}
                className={`py-2 rounded-lg text-sm transition-colors ${
                  hour === h
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Minute Selector */}
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-2">Minute</label>
          <div className="grid grid-cols-2 gap-2">
            {minutes.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMinute(m)}
                className={`py-2 rounded-lg text-sm transition-colors ${
                  minute === m
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {m.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AM/PM Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPeriod('AM')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            period === 'AM'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent hover:bg-accent/80'
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => setPeriod('PM')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            period === 'PM'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent hover:bg-accent/80'
          }`}
        >
          PM
        </button>
      </div>

      {/* Preview */}
      <div className="text-center p-3 bg-accent/50 rounded-lg">
        <span className="text-2xl font-semibold">
          {hour}:{minute.toString().padStart(2, '0')} {period}
        </span>
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApply}
        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Set Time
      </button>
    </div>
  );
};
