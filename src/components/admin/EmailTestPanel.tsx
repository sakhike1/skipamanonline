import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  XCircle, 
  Loader,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface EmailTestForm {
  to: string;
  subject: string;
  message: string;
}

const EmailTestPanel: React.FC = () => {
  const [form, setForm] = useState<EmailTestForm>({
    to: '',
    subject: 'SkipaMan Store - Test Email',
    message: 'This is a test email to verify that the email service is working correctly.'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await adminAPI.testEmail({
        to: form.to,
        subject: form.subject,
        message: form.message
      });

      if (response.success) {
        setSuccessMessage(`Test email sent successfully to ${form.to}!`);
        setForm(prev => ({ ...prev, to: '' })); // Clear email field
      } else {
        throw new Error(response.message || 'Failed to send test email');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send test email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Email Service Test</h2>
        </div>
        <p className="text-gray-600">Test the email configuration by sending a test email to verify the service is working correctly.</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Email Configuration Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-2">
          <Settings className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">Email Configuration</h3>
        </div>
        <div className="text-sm text-blue-800">
          <p className="mb-2">To configure email sending, set these environment variables in your backend:</p>
          <div className="bg-blue-100 p-3 rounded font-mono text-xs">
            <div>EMAIL_HOST=smtp.gmail.com</div>
            <div>EMAIL_PORT=587</div>
            <div>EMAIL_USER=your-email@gmail.com</div>
            <div>EMAIL_PASS=your-app-password</div>
          </div>
          <p className="mt-2 text-xs">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            If email credentials are not configured, emails will be logged to the console instead.
          </p>
        </div>
      </div>

      {/* Test Email Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Email Address *
          </label>
          <input
            type="email"
            name="to"
            value={form.to}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email address to send test to..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Subject
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email subject..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email message..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !form.to}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send Test Email
        </button>
      </form>

      {/* Email Features Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Order Emails</h4>
            <ul className="space-y-1">
              <li>• Order confirmation emails</li>
              <li>• Order status updates</li>
              <li>• Shipping notifications</li>
              <li>• Delivery confirmations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Email Templates</h4>
            <ul className="space-y-1">
              <li>• Professional HTML templates</li>
              <li>• Responsive design</li>
              <li>• Order details included</li>
              <li>• Branded styling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTestPanel;
