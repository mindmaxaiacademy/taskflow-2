import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LegalContentModal } from '../components/LegalContentModal';
import { PrivacyPolicyContent, TermsAndConditionsContent, SupportContent } from '../components/LegalContent';
import { Moon, Sun, Trash2, Download, Info, Shield, FileText, HelpCircle } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, clearCompletedTasks } = useTasks();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleThemeToggle = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const handleAutoCompleteToggle = () => {
    updateSettings({ autoCompleteParent: !settings.autoCompleteParent });
  };

  const handleClearCompleted = () => {
    clearCompletedTasks();
    setShowClearDialog(false);
  };

  const handleExportData = () => {
    const dataStr = localStorage.getItem('taskflow_tasks') || '[]';
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="max-w-screen-sm mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="mb-6">Settings</h1>

        {/* Appearance Section */}
        <div className="mb-6">
          <h3 className="mb-3 text-muted-foreground">Appearance</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                {settings.theme === 'light' ? (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                )}
                <div className="text-left">
                  <div>Theme</div>
                  <div className="text-sm text-muted-foreground capitalize">{settings.theme} mode</div>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${settings.theme === 'dark' ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${settings.theme === 'dark' ? 'translate-x-6' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Task Behavior Section */}
        <div className="mb-6">
          <h3 className="mb-3 text-muted-foreground">Task Behavior</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={handleAutoCompleteToggle}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <div className="text-left">
                <div>Auto-complete parent task</div>
                <div className="text-sm text-muted-foreground">
                  Complete parent when all subtasks are done
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${settings.autoCompleteParent ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${settings.autoCompleteParent ? 'translate-x-6' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="mb-6">
          <h3 className="mb-3 text-muted-foreground">Data Management</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            <button
              onClick={() => setShowClearDialog(true)}
              className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <div>Clear completed tasks</div>
                <div className="text-sm text-muted-foreground">
                  Remove all completed tasks
                </div>
              </div>
            </button>
            
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
            >
              <Download className="w-5 h-5 text-muted-foreground" />
              <div>
                <div>Export data</div>
                <div className="text-sm text-muted-foreground">
                  Download backup as JSON
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Support & Help Section */}
        <div className="mb-6">
          <h3 className="mb-3 text-muted-foreground">Support & Help</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setShowSupport(true)}
              className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
            >
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <div>Support & Help</div>
                <div className="text-sm text-muted-foreground">
                  FAQs, troubleshooting, and contact
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h3 className="mb-3 text-muted-foreground">About</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-muted-foreground" />
                <div>About Taskflow</div>
              </div>
              <p className="text-sm text-muted-foreground ml-8">
                Taskflow is a modern task management app designed for productivity and simplicity. Version 1.0.0
              </p>
            </div>
            
            <button
              onClick={() => setShowPrivacyPolicy(true)}
              className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
            >
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>Privacy Policy</div>
            </button>
            
            <button
              onClick={() => setShowTerms(true)}
              className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
            >
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>Terms & Conditions</div>
            </button>
          </div>
        </div>

        {/* Export Success Message */}
        {showExportSuccess && (
          <div className="fixed bottom-24 left-4 right-4 max-w-screen-sm mx-auto bg-green-600 text-white p-4 rounded-xl shadow-lg">
            Data exported successfully!
          </div>
        )}
      </div>

      {/* Clear Completed Confirmation */}
      <ConfirmDialog
        isOpen={showClearDialog}
        title="Clear Completed Tasks"
        message="Are you sure you want to clear all completed tasks? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={handleClearCompleted}
        onCancel={() => setShowClearDialog(false)}
      />

      {/* Privacy Policy Modal */}
      <LegalContentModal
        isOpen={showPrivacyPolicy}
        title="Privacy Policy"
        content={<PrivacyPolicyContent />}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      {/* Terms & Conditions Modal */}
      <LegalContentModal
        isOpen={showTerms}
        title="Terms & Conditions"
        content={<TermsAndConditionsContent />}
        onClose={() => setShowTerms(false)}
      />

      {/* Support Modal */}
      <LegalContentModal
        isOpen={showSupport}
        title="Support"
        content={<SupportContent />}
        onClose={() => setShowSupport(false)}
      />
    </div>
  );
};