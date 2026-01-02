import React, { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { AddTaskScreen } from './screens/AddTaskScreen';
import { StatsScreen } from './screens/StatsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SubtaskEditor } from './components/SubtaskEditor';
import { Task } from './types/task';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubtaskEditorOpen, setIsSubtaskEditorOpen] = useState(false);
  const [taskForSubtaskEdit, setTaskForSubtaskEdit] = useState<Task | null>(null);

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'add') {
      setEditingTask(null);
      setIsAddTaskOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskOpen(true);
  };

  const handleAddSubtasks = (task: Task) => {
    setTaskForSubtaskEdit(task);
    setIsSubtaskEditorOpen(true);
  };

  const handleCloseAddTask = () => {
    setIsAddTaskOpen(false);
    setEditingTask(null);
  };

  const handleCloseSubtaskEditor = () => {
    setIsSubtaskEditorOpen(false);
    setTaskForSubtaskEdit(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Screen Content */}
      {activeTab === 'home' && (
        <HomeScreen 
          onEditTask={handleEditTask}
          onAddSubtasks={handleAddSubtasks}
        />
      )}
      {activeTab === 'calendar' && (
        <CalendarScreen 
          onEditTask={handleEditTask}
          onAddSubtasks={handleAddSubtasks}
        />
      )}
      {activeTab === 'stats' && <StatsScreen />}
      {activeTab === 'settings' && <SettingsScreen />}

      {/* Add/Edit Task Modal */}
      <AddTaskScreen
        isOpen={isAddTaskOpen}
        onClose={handleCloseAddTask}
        editTask={editingTask}
      />

      {/* Subtask Editor Modal */}
      <SubtaskEditor
        isOpen={isSubtaskEditorOpen}
        onClose={handleCloseSubtaskEditor}
        task={taskForSubtaskEdit}
      />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}