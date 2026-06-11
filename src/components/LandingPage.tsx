import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStartScheduling: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartScheduling }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Calendar className="w-16 h-16 text-indigo-600" />
            <h1 className="text-6xl font-bold text-gray-900">Plan-elope</h1>
          </div>
          
          <p className="text-2xl font-medium text-gray-700 mb-4">
            Stop being busy. Start being intentional.
          </p>
          
          <p className="text-lg text-gray-600 mb-12">
            Your AI-powered life planner that aligns your schedule with your goals.
          </p>

          <button
            onClick={onStartScheduling}
            className="group bg-indigo-600 text-white px-12 py-4 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="flex items-center gap-3">
              Start Scheduling
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
