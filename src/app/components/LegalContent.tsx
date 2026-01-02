import React from 'react';
import { Copy, Mail, Bug, MessageSquare, Check } from 'lucide-react';

export const SupportContent: React.FC = () => {
  const [emailCopied, setEmailCopied] = React.useState(false);
  const supportEmail = 'FlowLabs.help@gmail.com';

  const handleCopyEmail = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(supportEmail);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } else {
        // Fallback for older browsers or blocked clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = supportEmail;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
          setEmailCopied(true);
          setTimeout(() => setEmailCopied(false), 2000);
        } catch (err) {
          console.error('Fallback: Failed to copy', err);
          textArea.remove();
        }
      }
    } catch (err) {
      console.error('Failed to copy email:', err);
      // Fallback: Try the old method
      const textArea = document.createElement('textarea');
      textArea.value = supportEmail;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        textArea.remove();
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback: Failed to copy', fallbackErr);
        textArea.remove();
      }
    }
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${supportEmail}?subject=TaskFlow Support Request`;
  };

  const handleReportBug = () => {
    window.location.href = `mailto:${supportEmail}?subject=TaskFlow Bug Report`;
  };

  const handleSendFeedback = () => {
    window.location.href = `mailto:${supportEmail}?subject=TaskFlow Feedback`;
  };

  return (
    <div className="space-y-6">
      {/* FAQs */}
      <div>
        <h3 className="text-lg font-semibold mb-3">🔹 Frequently Asked Questions</h3>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-1">Q: Why am I not receiving notifications?</p>
            <p className="text-muted-foreground">A: Please ensure notifications are enabled for TaskFlow in your device settings. Battery optimization or system restrictions may also prevent reminders.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">Q: Can I use TaskFlow without an account?</p>
            <p className="text-muted-foreground">A: Yes. TaskFlow works without sign-in. Your data is stored locally on your device.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">Q: Will my tasks be lost if I uninstall the app?</p>
            <p className="text-muted-foreground">A: Yes. If syncing is not enabled, uninstalling the app will remove local data.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">Q: Why don't some settings apply immediately?</p>
            <p className="text-muted-foreground">A: Some settings affect only new tasks or require a refresh to fully apply.</p>
          </div>
        </div>
      </div>

      {/* Common Issues */}
      <div>
        <h3 className="text-lg font-semibold mb-3">🔹 Common Issues</h3>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-2">Notifications not working</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Check device notification permissions</li>
              <li>Disable battery optimization</li>
              <li>Ensure a reminder time is set</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">Settings not applying</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Restart the app</li>
              <li>Verify the setting applies to existing tasks</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">App feels slow</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Close and reopen the app</li>
              <li>Ensure you're on the latest version</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div>
        <h3 className="text-lg font-semibold mb-3">🔹 Contact Support</h3>
        <p className="mb-3">If you need help, feedback, or want to report a bug, contact us:</p>
        
        <div className="bg-accent/50 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-semibold">Email:</span>
          </div>
          <p className="mb-3 text-primary">{supportEmail}</p>
          
          <button
            onClick={handleCopyEmail}
            className="w-full py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {emailCopied ? (
              <>
                <Check className="w-4 h-4" />
                Email Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Email
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">⏱ Response time: 24–48 hours</p>

        {/* App Information */}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">🔹 App Information</h3>
        <div className="bg-accent/50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">App Name:</span>
            <span className="font-medium">TaskFlow</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Developer:</span>
            <span className="font-medium">FlowLabs Studio</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform:</span>
            <span className="font-medium">Web / Android</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Privacy Policy for TaskFlow</h3>
      <p className="text-sm text-muted-foreground">Last updated: December 2025</p>
      
      <p>TaskFlow respects your privacy. This Privacy Policy explains how your information is collected, used, and protected when you use the TaskFlow application.</p>

      <div>
        <h4 className="font-semibold mb-2">1. Information We Collect</h4>
        <p className="mb-2">TaskFlow may collect the following information:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Task data you create (titles, descriptions, due dates, reminders)</li>
          <li>App preferences and settings</li>
          <li>Device and browser information for performance and debugging</li>
        </ul>
        <p className="mt-2 mb-2">We do NOT collect:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Personal identity information without your consent</li>
          <li>Contacts, photos, or files outside the app</li>
          <li>Sensitive personal data</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">2. How Your Data Is Used</h4>
        <p className="mb-2">Your data is used only to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Store and display your tasks</li>
          <li>Enable reminders and notifications</li>
          <li>Improve app performance and user experience</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">3. Data Storage</h4>
        <p>All task and settings data are stored locally on your device or securely in cloud storage if syncing is enabled. We do not sell or share your data with third parties.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">4. Notifications</h4>
        <p>TaskFlow uses notifications solely to remind you about tasks you have created. Notifications can be disabled at any time from device or app settings.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">5. Third-Party Services</h4>
        <p>TaskFlow may use trusted services (such as analytics or notification services) strictly to operate core functionality. These services follow their own privacy policies.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">6. Data Security</h4>
        <p>We take reasonable measures to protect your data. However, no method of digital storage is completely secure.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">7. Your Choices</h4>
        <p className="mb-2">You can:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Modify or delete tasks at any time</li>
          <li>Disable notifications</li>
          <li>Stop using the app at any time</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-2">8. Changes to This Policy</h4>
        <p>This Privacy Policy may be updated occasionally. Continued use of TaskFlow means you accept the updated policy.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">9. Contact</h4>
        <p>If you have questions about this Privacy Policy, please contact us through the app support section.</p>
      </div>
    </div>
  );
};

export const TermsAndConditionsContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Terms and Conditions for TaskFlow</h3>
      <p className="text-sm text-muted-foreground">Last updated: December 2025</p>
      
      <p>By using TaskFlow, you agree to the following terms and conditions.</p>

      <div>
        <h4 className="font-semibold mb-2">1. Use of the App</h4>
        <p>TaskFlow is provided as a task management tool for personal productivity. You agree to use the app responsibly and lawfully.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">2. User Content</h4>
        <p>All tasks, notes, and data you create belong to you. You are responsible for the accuracy and legality of the content you enter.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">3. No Warranty</h4>
        <p>TaskFlow is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service or error-free operation.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">4. Limitation of Liability</h4>
        <p className="mb-2">TaskFlow is not responsible for:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Missed reminders</li>
          <li>Lost data due to device or system failure</li>
          <li>Productivity outcomes</li>
        </ul>
        <p className="mt-2">Use the app at your own discretion.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">5. Modifications</h4>
        <p>Features, functionality, or availability of TaskFlow may change at any time without notice.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">6. Termination</h4>
        <p>We reserve the right to restrict or discontinue access to the app if misuse is detected.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">7. Governing Law</h4>
        <p>These terms are governed by applicable local laws.</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">8. Acceptance</h4>
        <p>By continuing to use TaskFlow, you acknowledge that you have read, understood, and agree to these Terms & Conditions.</p>
      </div>
    </div>
  );
};