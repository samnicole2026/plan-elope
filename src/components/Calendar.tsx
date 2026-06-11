import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, CalendarView, Category } from '../types';

interface CalendarProps {
  scheduledTasks: Task[];
  onAddTask: (date: string) => void;
  onRemoveTask: (taskId: string) => void;
  categories: Category[];
}

export const Calendar: React.FC<CalendarProps> = ({ scheduledTasks, onAddTask, onRemoveTask, categories }) => {
  const [view, setView] = useState<CalendarView>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledTasks.filter(task => task.date === dateStr);
  };

  const getCategoryColor = (categoryName: string) => {
    return categories.find(c => c.name === categoryName)?.color || '#9CA3AF';
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'daily':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'weekly':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'monthly':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'yearly':
        newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const renderDailyView = () => {
    const tasks = getTasksForDate(currentDate);
    const dateStr = currentDate.toISOString().split('T')[0];

    return (
      <div className="border rounded-lg p-6 bg-gray-50 min-h-[400px]">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No events scheduled for this day</p>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md border-l-4`}
                style={{ 
                  borderLeftColor: getCategoryColor(task.category),
                  backgroundColor: task.isLockedIn ? '#F0FDF4' : '#EFF6FF'
                }}
                onClick={() => onRemoveTask(task.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-900">{task.name}</div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(task.category) }}
                  />
                </div>
                <div className="text-sm text-gray-600 mb-1">{task.category}</div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {task.isAllDay ? (
                    <div className="font-medium">All Day</div>
                  ) : task.time ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.time}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{task.importance}/5</span>
                  </div>
                  <div>
                    {task.duration}{task.durationType === 'hours' ? 'h' : 'd'}
                  </div>
                </div>
                {task.isMovable && task.deadline && (
                  <div className="text-red-600 mt-2 text-sm font-medium">
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          )}

          <button
            onClick={() => onAddTask(dateStr)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
          >
            <Plus className="w-5 h-5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
        {days.map((day, index) => {
          const tasks = getTasksForDate(day);
          const dateStr = day.toISOString().split('T')[0];
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`border rounded-lg p-3 min-h-[200px] ${
                isToday ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-xs font-medium text-gray-500">{dayNames[index]}</div>
                <div className={`text-lg font-bold ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
              </div>

              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className="text-xs p-2 rounded cursor-pointer transition-all hover:shadow-md border-l-2"
                    style={{ 
                      borderLeftColor: getCategoryColor(task.category),
                      backgroundColor: task.isLockedIn ? '#F0FDF4' : '#EFF6FF'
                    }}
                    onClick={() => onRemoveTask(task.id)}
                  >
                    <div className="font-medium text-gray-900 truncate mb-1">{task.name}</div>
                    {task.isAllDay ? (
                      <div className="text-gray-600 mb-1">All Day</div>
                    ) : task.time ? (
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.time}</span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-1 text-gray-600">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getCategoryColor(task.category) }}
                      />
                      <span className="truncate">{task.category}</span>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => onAddTask(dateStr)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1 text-gray-500 hover:text-indigo-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthlyView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    const currentDay = new Date(startDate);
    
    while (days.length < 42) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(name => (
            <div key={name} className="text-center text-sm font-semibold text-gray-600 py-2">
              {name}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const tasks = getTasksForDate(day);
            const dateStr = day.toISOString().split('T')[0];
            const isCurrentMonth = day.getMonth() === month;
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`border rounded-lg p-2 min-h-[120px] ${
                  isToday ? 'border-indigo-500 bg-indigo-50' : 
                  isCurrentMonth ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm font-medium ${
                    isToday ? 'text-indigo-600' : 
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </div>
                  {isCurrentMonth && (
                    <button
                      onClick={() => onAddTask(dateStr)}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-indigo-100 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {tasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className="text-xs p-1.5 rounded cursor-pointer truncate border-l-2"
                      style={{ 
                        borderLeftColor: getCategoryColor(task.category),
                        backgroundColor: task.isLockedIn ? '#F0FDF4' : '#EFF6FF'
                      }}
                      onClick={() => onRemoveTask(task.id)}
                      title={`${task.name} - ${task.category}`}
                    >
                      {task.isAllDay ? (
                        <span className="font-medium">{task.name}</span>
                      ) : task.time ? (
                        <>
                          <span className="font-medium">{task.time}</span> {task.name}
                        </>
                      ) : (
                        <span>{task.name}</span>
                      )}
                    </div>
                  ))}
                  {tasks.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{tasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearlyView = () => {
    const year = currentDate.getFullYear();
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      months.push(new Date(year, i, 1));
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month, index) => {
          const monthStart = new Date(year, index, 1);
          const monthEnd = new Date(year, index + 1, 0);
          const tasksInMonth = scheduledTasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= monthStart && taskDate <= monthEnd;
          });

          const categoryCounts = tasksInMonth.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          return (
            <div
              key={index}
              className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setCurrentDate(month);
                setView('monthly');
              }}
            >
              <div className="font-semibold text-gray-900 mb-2">
                {month.toLocaleDateString('en-US', { month: 'long' })}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {tasksInMonth.length} {tasksInMonth.length === 1 ? 'event' : 'events'}
              </div>
              {Object.entries(categoryCounts).length > 0 && (
                <div className="space-y-1">
                  {Object.entries(categoryCounts).slice(0, 3).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getCategoryColor(cat) }}
                      />
                      <span className="text-gray-700">{cat}: {count}</span>
                    </div>
                  ))}
                  {Object.entries(categoryCounts).length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{Object.entries(categoryCounts).length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getViewTitle = () => {
    switch (view) {
      case 'daily':
        return currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      case 'weekly':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'yearly':
        return currentDate.getFullYear().toString();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as CalendarView)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateDate('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-lg font-semibold text-gray-900">
          {getViewTitle()}
        </div>

        <button
          onClick={() => navigateDate('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {view === 'daily' && renderDailyView()}
      {view === 'weekly' && renderWeeklyView()}
      {view === 'monthly' && renderMonthlyView()}
      {view === 'yearly' && renderYearlyView()}
    </div>
  );
};
