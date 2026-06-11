import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Task } from '../types';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  preselectedDate?: string;
  onClose?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, preselectedDate, onClose }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(preselectedDate || '');
  const [time, setTime] = useState('');
  const [importance, setImportance] = useState(3);
  const [isMovable, setIsMovable] = useState(false);
  const [isLockedIn, setIsLockedIn] = useState(false);
  const [movabilityRange, setMovabilityRange] = useState(3);
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState(1);
  const [durationType, setDurationType] = useState<'hours' | 'days'>('hours');
  const [isScheduled, setIsScheduled] = useState(!!preselectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    if (isMovable && !deadline) {
      alert('Please set a deadline for movable tasks');
      return;
    }

    if (isScheduled && !date) {
      alert('Please select a date for scheduled tasks');
      return;
    }

    onAddTask({
      name: name.trim(),
      date: isScheduled ? date : '',
      time: time || undefined,
      importance,
      isMovable,
      isLockedIn,
      movabilityRange: isMovable ? movabilityRange : undefined,
      deadline: isMovable ? deadline : undefined,
      duration,
      durationType,
    });

    setName('');
    setDate(preselectedDate || '');
    setTime('');
    setImportance(3);
    setIsMovable(false);
    setIsLockedIn(false);
    setMovabilityRange(3);
    setDeadline('');
    setDuration(1);
    setDurationType('hours');
    setIsScheduled(!!preselectedDate);

    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Add Task</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Study for Math Exam"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => {
                setIsScheduled(e.target.checked);
                if (!e.target.checked) {
                  setDate('');
                  setTime('');
                }
              }}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">Schedule this task now</span>
          </label>

          {isScheduled && (
            <div className="space-y-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required={isScheduled}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Time (optional)"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Importance: {importance}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={importance}
            onChange={(e) => setImportance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isMovable}
                onChange={() => setIsMovable(true)}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Movable</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!isMovable}
                onChange={() => setIsMovable(false)}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Immovable</span>
            </label>
          </div>
        </div>

        {isMovable && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required={isMovable}
              />
              <p className="text-xs text-gray-500 mt-1">When this task absolutely must be completed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movability Range: ±{movabilityRange} days
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={movabilityRange}
                onChange={(e) => setMovabilityRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <select
              value={durationType}
              onChange={(e) => setDurationType(e.target.value as 'hours' | 'days')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isLockedIn}
              onChange={(e) => setIsLockedIn(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Locked In (confirmed/committed)</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </form>
    </div>
  );
};
