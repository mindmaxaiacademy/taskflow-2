import React, { useState } from 'react';
import { Mark, MarkType } from '../types/task';
import { Flag, Hash, Gauge, Smile, X } from 'lucide-react';

interface MarkSelectorProps {
  value: Mark;
  onChange: (mark: Mark) => void;
}

export const MarkSelector: React.FC<MarkSelectorProps> = ({ value, onChange }) => {
  const [selectedType, setSelectedType] = useState<MarkType>(value.type);

  const markTypes = [
    { type: 'none' as MarkType, icon: X, label: 'None' },
    { type: 'flag' as MarkType, icon: Flag, label: 'Flags' },
    { type: 'number' as MarkType, icon: Hash, label: 'Priority' },
    { type: 'progress' as MarkType, icon: Gauge, label: 'Progress' },
    { type: 'mood' as MarkType, icon: Smile, label: 'Mood' },
  ];

  const flagOptions = [
    { value: '🚩', label: 'Red Flag' },
    { value: '🟡', label: 'Yellow' },
    { value: '🟣', label: 'Purple' },
    { value: '🔵', label: 'Blue' },
    { value: '🟢', label: 'Green' },
  ];

  const numberOptions = [
    { value: '1️⃣', label: 'Priority 1' },
    { value: '2️⃣', label: 'Priority 2' },
    { value: '3️⃣', label: 'Priority 3' },
    { value: '4️⃣', label: 'Priority 4' },
    { value: '5️⃣', label: 'Priority 5' },
  ];

  const progressOptions = [
    { value: '◔', label: '25%' },
    { value: '◑', label: '50%' },
    { value: '◕', label: '75%' },
    { value: '●', label: '100%' },
  ];

  const moodOptions = [
    { value: '😀', label: 'Happy' },
    { value: '🙂', label: 'Good' },
    { value: '😐', label: 'Neutral' },
    { value: '😔', label: 'Sad' },
    { value: '😣', label: 'Stressed' },
  ];

  const getOptionsForType = (type: MarkType) => {
    switch (type) {
      case 'flag':
        return flagOptions;
      case 'number':
        return numberOptions;
      case 'progress':
        return progressOptions;
      case 'mood':
        return moodOptions;
      default:
        return [];
    }
  };

  const handleTypeSelect = (type: MarkType) => {
    setSelectedType(type);
    if (type === 'none') {
      onChange({ type: 'none', value: null });
    }
  };

  const handleValueSelect = (markValue: string) => {
    onChange({ type: selectedType, value: markValue });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Mark with Symbol</label>
      
      {/* Type Selector */}
      <div className="grid grid-cols-5 gap-2">
        {markTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.type}
              type="button"
              onClick={() => handleTypeSelect(type.type)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                selectedType === type.type
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-accent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Value Selector */}
      {selectedType !== 'none' && (
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Select {markTypes.find(t => t.type === selectedType)?.label}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {getOptionsForType(selectedType).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleValueSelect(option.value)}
                className={`p-3 rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                  value.type === selectedType && value.value === option.value
                    ? 'bg-primary/10 border-primary ring-2 ring-primary'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                <span className="text-2xl">{option.value}</span>
                <span className="text-xs text-muted-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Selection Display */}
      {value.type !== 'none' && value.value && (
        <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
          <span className="text-sm text-muted-foreground">Selected:</span>
          <span className="text-2xl">{value.value}</span>
          <button
            type="button"
            onClick={() => onChange({ type: 'none', value: null })}
            className="ml-auto p-1 hover:bg-destructive/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
