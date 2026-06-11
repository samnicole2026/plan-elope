import React, { useState } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';

interface CalendarConnectProps {
  onClose: () => void;
  onConnect: (provider: 'google' | 'outlook') => void;
}

export const CalendarConnect: React.FC<CalendarConnectProps> = ({ onClose, onConnect }) => {
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'outlook' | null>(null);

  const handleConnect = () => {
    if (selectedProvider) {
      onConnect(selectedProvider);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">Connect Your Calendar</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <p className="text-gray-600 mb-6 text-center">
            Choose your calendar provider to sync your events automatically
          </p>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => setSelectedProvider('google')}
              className={`w-full p-6 border-2 rounded-xl transition-all ${
                selectedProvider === 'google'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
                    <p className="text-sm text-gray-600">Connect with your Google account</p>
                  </div>
                </div>
                {selectedProvider === 'google' && (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelectedProvider('outlook')}
              className={`w-full p-6 border-2 rounded-xl transition-all ${
                selectedProvider === 'outlook'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                      <path fill="#0078D4" d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z"/>
                      <path fill="#0078D4" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Outlook Calendar</h3>
                    <p className="text-sm text-gray-600">Connect with your Microsoft account</p>
                  </div>
                </div>
                {selectedProvider === 'outlook' && (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                )}
              </div>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              disabled={!selectedProvider}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Connect Calendar
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            We'll only access your calendar events. Your data is secure and private.
          </p>
        </div>
      </div>
    </div>
  );
};
