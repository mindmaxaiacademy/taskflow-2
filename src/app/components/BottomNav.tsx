import React from 'react';
import { Home, Calendar, Plus, BarChart3, Settings } from 'lucide-react';

export type NavTab = 'home' | 'calendar' | 'add' | 'stats' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home' as NavTab, icon: Home, label: 'Home' },
    { id: 'calendar' as NavTab, icon: Calendar, label: 'Calendar' },
    { id: 'add' as NavTab, icon: Plus, label: 'Add', special: true },
    { id: 'stats' as NavTab, icon: BarChart3, label: 'Stats' },
    { id: 'settings' as NavTab, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40">
      <div className="max-w-screen-sm mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (item.special) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="flex flex-col items-center justify-center w-14 h-14 -mt-6 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform"
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-lg transition-colors min-w-[60px] ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};