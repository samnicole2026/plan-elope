import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { SignInModal } from './components/SignInModal';
import { Sidebar } from './components/Sidebar';
import { SplitScreenOnboarding } from './components/SplitScreenOnboarding';
import { ChatInterface } from './components/ChatInterface';
import { CalendarConnect } from './components/CalendarConnect';
import { Calendar } from './components/Calendar';
import { EventForm } from './components/EventForm';
import { UnscheduledTasks } from './components/UnscheduledTasks';
import { Goals } from './components/Goals';
import { AIAnalysis } from './components/AIAnalysis';
import { Task, Goal, AIAnalysisResult, Category } from './types';
import { defaultCategories } from './data/categories';

type AppState = 'landing' | 'onboarding' | 'chat' | 'connect' | 'main';

interface User {
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
}

interface ChatSession {
  id: string;
  name: string;
  date: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [showEventForm, setShowEventForm] = useState(false);

  const handleStartScheduling = () => {
    setShowSignInModal(true);
  };

  const handleSignIn = (method: 'email' | 'google' | 'microsoft' | 'guest', email?: string) => {
    if (method === 'guest') {
      setUser({
        name: 'Guest User',
        email: 'guest@planelope.com',
        isGuest: true,
      });
    } else if (method === 'email' && email) {
      setUser({
        name: email.split('@')[0],
        email: email,
        isGuest: false,
      });
    } else if (method === 'google') {
      setUser({
        name: 'Google User',
        email: 'user@gmail.com',
        isGuest: false,
      });
    } else if (method === 'microsoft') {
      setUser({
        name: 'Microsoft User',
        email: 'user@outlook.com',
        isGuest: false,
      });
    }
    setShowSignInModal(false);
    setAppState('onboarding');
  };

  const handleLogOut = () => {
    setUser(null);
    setAppState('landing');
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    setShowEventForm(false);
    setSelectedDate(undefined);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleAddGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals([...goals, newGoal]);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const handleAcceptSchedule = (result: AIAnalysisResult) => {
    const updatedTasks = [...tasks];
    
    result.suggestions.forEach(suggestion => {
      const taskIndex = updatedTasks.findIndex(t => t.id === suggestion.taskId);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          date: suggestion.suggestedDate,
          time: suggestion.suggestedTime,
        };
      }
    });

    setTasks(updatedTasks);
  };

  const handleOpenEventForm = (date: string) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleCalendarConnect = (provider: 'google' | 'outlook') => {
    console.log(`Connecting to ${provider} calendar...`);
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar connection will be implemented soon!`);
    setAppState('main');
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Chat ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
    };
    setChatSessions([newSession, ...chatSessions]);
    setAppState('onboarding');
  };

  const handleSelectChat = (chatId: string) => {
    console.log('Selected chat:', chatId);
    setAppState('onboarding');
  };

  const scheduledTasks = tasks.filter(t => t.date);
  const unscheduledTasks = tasks.filter(t => !t.date);

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onStartScheduling={handleStartScheduling} />;
      
      case 'onboarding':
      case 'chat':
      case 'connect':
        return (
          <SplitScreenOnboarding
            initialView={appState === 'chat' ? 'chat' : appState === 'connect' ? 'connect' : 'onboarding'}
            onClose={() => setAppState('main')}
            onChatWithPlanelope={() => setAppState('chat')}
            onConnectCalendar={() => setAppState('connect')}
            onInputCalendar={() => setAppState('main')}
            categories={categories}
          />
        );
      
      case 'main':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Calendar
                  scheduledTasks={scheduledTasks}
                  onAddTask={handleOpenEventForm}
                  onRemoveTask={handleRemoveTask}
                  categories={categories}
                />

                <AIAnalysis
                  tasks={tasks}
                  goals={goals}
                  onAcceptSchedule={handleAcceptSchedule}
                />
              </div>

              <div className="space-y-6">
                <UnscheduledTasks
                  tasks={unscheduledTasks}
                  onScheduleTask={(taskId, date) => {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                      setTasks(tasks.map(t => 
                        t.id === taskId ? { ...t, date } : t
                      ));
                    }
                  }}
                  onRemoveTask={handleRemoveTask}
                  categories={categories}
                />

                <Goals
                  goals={goals}
                  onAddGoal={handleAddGoal}
                  onDeleteGoal={handleDeleteGoal}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar - Always Visible */}
      <Sidebar
        user={user}
        chatSessions={chatSessions}
        onSignIn={() => setShowSignInModal(true)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onCalendars={() => setAppState('main')}
        onSettings={() => alert('Settings coming soon!')}
        onAppearance={() => alert('Appearance settings coming soon!')}
        onLogOut={handleLogOut}
        onSwitchAccount={() => alert('Account switching coming soon!')}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-20 overflow-auto pb-20 lg:pb-0">
        {renderContent()}
      </div>

      {/* Modals */}
      {showEventForm && selectedDate && (
        <EventForm
          onAddEvent={handleAddTask}
          onClose={() => {
            setShowEventForm(false);
            setSelectedDate(undefined);
          }}
          preselectedDate={selectedDate}
          categories={categories}
          onAddCategory={handleAddCategory}
        />
      )}

      {showSignInModal && (
        <SignInModal
          onClose={() => setShowSignInModal(false)}
          onSignIn={handleSignIn}
        />
      )}
    </div>
  );
}

export default App;
