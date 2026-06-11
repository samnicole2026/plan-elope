import React, { useState } from 'react';
import { Target, Plus, Trash2, Check } from 'lucide-react';
import { Goal } from '../types';
import { suggestedGoals } from '../data/suggestedGoals';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const Goals: React.FC<GoalsProps> = ({ goals, onAddGoal, onDeleteGoal }) => {
  const [activeTab, setActiveTab] = useState<'short-term' | 'long-term'>('short-term');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [addedGoals, setAddedGoals] = useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      title: title.trim(),
      description: description.trim(),
      deadline: deadline || undefined,
      type: activeTab,
    });

    setTitle('');
    setDescription('');
    setDeadline('');
    setShowForm(false);
  };

  const handleAddSuggestedGoal = (goalText: string, goalType: 'short-term' | 'long-term') => {
    // Add the goal
    onAddGoal({
      title: goalText,
      description: '',
      type: goalType,
    });

    // Mark as added with visual feedback
    setAddedGoals(prev => new Set(prev).add(goalText));
    
    // Remove the visual feedback after 2 seconds
    setTimeout(() => {
      setAddedGoals(prev => {
        const newSet = new Set(prev);
        newSet.delete(goalText);
        return newSet;
      });
    }, 2000);
  };

  const categories = ['Career', 'School/Learning', 'Health/Lifestyle', 'Projects', 'Finance', 'Relationships'];
  const filteredGoals = goals.filter(g => g.type === activeTab);
  const filteredSuggestions = suggestedGoals.filter(g => g.type === activeTab);

  // Check if a goal already exists in user's goals
  const isGoalAdded = (goalText: string) => {
    return goals.some(g => g.title.toLowerCase() === goalText.toLowerCase());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Goals</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('short-term')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'short-term'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Short-term goals
        </button>
        <button
          onClick={() => setActiveTab('long-term')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'long-term'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Long-term goals
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-purple-50 rounded-lg space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={2}
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Deadline (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Save Goal
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* User's Goals */}
      {filteredGoals.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">My Goals</h3>
          <div className="space-y-3">
            {filteredGoals.map(goal => (
              <div key={goal.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {goal.description && (
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                )}
                {goal.deadline && (
                  <div className="text-xs text-purple-700 font-medium">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Goals */}
      <div>
        <p className="text-sm text-gray-600 mb-4">Click any goal to add it to your list.</p>
        
        {categories.map(category => {
          const categoryGoals = filteredSuggestions.filter(g => g.category === category);
          if (categoryGoals.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryGoals.map((goal, index) => {
                  const isAdded = isGoalAdded(goal.text);
                  const justAdded = addedGoals.has(goal.text);

                  return (
                    <button
                      key={index}
                      onClick={() => !isAdded && handleAddSuggestedGoal(goal.text, goal.type)}
                      disabled={isAdded}
                      className={`px-3 py-2 border rounded-full text-sm transition-all flex items-center gap-2 group ${
                        isAdded
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                          : justAdded
                          ? 'bg-green-100 border-green-400 text-green-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                      }`}
                    >
                      {justAdded ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Plus className={`w-3 h-3 ${
                          isAdded ? 'text-gray-400' : 'text-gray-400 group-hover:text-purple-600'
                        }`} />
                      )}
                      <span>{goal.text}</span>
                      {isAdded && !justAdded && (
                        <Check className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
