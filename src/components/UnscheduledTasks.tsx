import React from 'react';
import { Clock, Calendar, X } from 'lucide-react';
import { Task, Category } from '../types';

interface UnscheduledTasksProps {
  tasks: Task[];
  onScheduleTask: (taskId: string, date: string) => void;
  onRemoveTask: (taskId: string) => void;
  categories: Category[];
}

export const UnscheduledTasks: React.FC<UnscheduledTasksProps> = ({ 
  tasks, 
  onScheduleTask, 
  onRemoveTask,
  categories 
}) => {
  const getCategoryColor = (categoryName: string) => {
    return categories.find(c => c.name === categoryName)?.color || '#9CA3AF';
  };

  if (tasks.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-900">Unscheduled Events</h2>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className="border border-orange-200 rounded-lg p-4 bg-orange-50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-900 mb-1">{task.name}</div>
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(task.category) }}
                  />
                  <span className="text-gray-600">{task.category}</span>
                </div>
              </div>
              <button
                onClick={() => onRemoveTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <span>★</span>
                <span>{task.importance}/5</span>
              </div>
              <div>
                {task.duration}{task.durationType === 'hours' ? 'h' : 'd'}
              </div>
            </div>

            <input
              type="date"
              onChange={(e) => onScheduleTask(task.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Schedule this event"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
