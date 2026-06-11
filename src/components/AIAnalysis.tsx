import React, { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, AlertCircle, TrendingUp, Calendar as CalendarIcon, List } from 'lucide-react';
import { Task, Goal, AIAnalysisResult } from '../types';

interface AIAnalysisProps {
  tasks: Task[];
  goals: Goal[];
  onAcceptSchedule: (result: AIAnalysisResult) => void;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ tasks, goals, onAcceptSchedule }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockResult: AIAnalysisResult = {
      suggestions: [
        {
          taskId: tasks[0]?.id || '1',
          taskName: tasks[0]?.name || 'Study for Math Exam',
          suggestedDate: '2024-12-15',
          suggestedTime: '09:00',
          reason: 'Morning hours align with peak cognitive performance for analytical tasks',
          priority: 'high',
        },
        {
          taskId: tasks[1]?.id || '2',
          taskName: tasks[1]?.name || 'Complete Research Paper',
          suggestedDate: '2024-12-16',
          suggestedTime: '14:00',
          reason: 'Afternoon slot provides sufficient time before deadline with minimal conflicts',
          priority: 'high',
        },
        {
          taskId: tasks[2]?.id || '3',
          taskName: tasks[2]?.name || 'Group Project Meeting',
          suggestedDate: '2024-12-17',
          suggestedTime: '16:00',
          reason: 'Late afternoon allows for preparation time and team availability',
          priority: 'medium',
        },
      ],
      conflicts: [
        {
          tasks: ['Study for Math Exam', 'Complete Research Paper'],
          issue: 'Both tasks have overlapping deadlines within 2 days',
          recommendation: 'Prioritize Math Exam (higher importance: 5) and allocate Research Paper to earlier time slots',
        },
      ],
      priorityRecommendations: [
        {
          taskName: 'Study for Math Exam',
          reason: 'Highest importance (5/5) with imminent deadline and direct contribution to Academic Excellence goal',
          shouldPrioritize: true,
        },
        {
          taskName: 'Gym Session',
          reason: 'Lower priority due to flexible nature and no direct goal alignment',
          shouldPrioritize: false,
        },
      ],
    };

    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const renderCalendarView = () => {
    if (!result) return null;

    // Group suggestions by date
    const suggestionsByDate = result.suggestions.reduce((acc, suggestion) => {
      if (!acc[suggestion.suggestedDate]) {
        acc[suggestion.suggestedDate] = [];
      }
      acc[suggestion.suggestedDate].push(suggestion);
      return acc;
    }, {} as Record<string, typeof result.suggestions>);

    // Get date range
    const dates = Object.keys(suggestionsByDate).sort();
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    
    // Generate all dates in range
    const allDates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      allDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {allDates.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dateSuggestions = suggestionsByDate[dateStr] || [];
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`border rounded-lg p-3 min-h-[150px] ${
                isToday ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-xs font-medium text-gray-500">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </div>
              </div>

              <div className="space-y-2">
                {dateSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-2 rounded border ${getPriorityColor(suggestion.priority)}`}
                  >
                    <div className="font-medium mb-1">{suggestion.taskName}</div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span>🕐</span>
                      <span>{suggestion.suggestedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">AI Schedule Optimizer</h2>
      </div>

      {!result ? (
        <div className="text-center py-8">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || tasks.length === 0}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            {isAnalyzing ? 'Analyzing Schedule...' : 'Optimize My Schedule'}
          </button>
          {tasks.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">Add some tasks to get AI-powered scheduling suggestions</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* View Toggle */}
          <div className="flex items-center justify-center gap-2 border-b pb-4">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar View
            </button>
          </div>

          {viewMode === 'list' ? (
            <>
              {/* Scheduling Suggestions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  Suggested Schedule
                </h3>
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(suggestion.priority)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{suggestion.taskName}</h4>
                        <span className="text-xs font-semibold uppercase px-2 py-1 rounded">
                          {suggestion.priority}
                        </span>
                      </div>
                      <div className="text-sm mb-2">
                        <span className="font-medium">📅 {new Date(suggestion.suggestedDate).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">🕐 {suggestion.suggestedTime}</span>
                      </div>
                      <p className="text-sm opacity-90">{suggestion.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conflicts */}
              {result.conflicts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Scheduling Conflicts
                  </h3>
                  <div className="space-y-3">
                    {result.conflicts.map((conflict, index) => (
                      <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="font-medium text-orange-900 mb-1">
                          {conflict.tasks.join(' & ')}
                        </div>
                        <p className="text-sm text-orange-800 mb-2">{conflict.issue}</p>
                        <div className="bg-white rounded p-3 text-sm text-gray-700">
                          <span className="font-medium">💡 Recommendation:</span> {conflict.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Priority Recommendations */}
              {result.priorityRecommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Priority Recommendations
                  </h3>
                  <div className="space-y-2">
                    {result.priorityRecommendations.map((rec, index) => (
                      <div key={index} className={`rounded-lg p-3 text-sm ${
                        rec.shouldPrioritize 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{rec.shouldPrioritize ? '⬆️' : '⬇️'}</span>
                          <span className="font-medium text-gray-900">{rec.taskName}</span>
                        </div>
                        <p className="text-gray-700 ml-7">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Suggested Schedule Calendar</h3>
              {renderCalendarView()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => {
                onAcceptSchedule(result);
                setResult(null);
              }}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Apply Suggestions
            </button>
            <button
              onClick={() => setResult(null)}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Dismiss
            </button>
          </div>

          <button
            onClick={handleAnalyze}
            className="w-full bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
          >
            Re-analyze Schedule
          </button>
        </div>
      )}
    </div>
  );
};
