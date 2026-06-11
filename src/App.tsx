import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { SignInModal } from './components/SignInModal';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { Calendar } from './components/Calendar';
import { EventForm } from './components/EventForm';
import { Task, Goal, Category } from './types';
import { defaultCategories } from './data/categories';

type AppState = 'landing' | 'chat-only' | 'split-screen';

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
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [showEventForm, setShowEventForm] = useState(false);
  const [hasCalendar, setHasCalendar] = useState(false);

  // Session persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('planelope_user');
    const savedTasks = localStorage.getItem('planelope_tasks');
    const savedGoals = localStorage.getItem('planelope_goals');
    const savedChats = localStorage.getItem('planelope_chats');
    const savedHasCalendar = localStorage.getItem('planelope_has_calendar');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Determine app state based on calendar existence
      if (savedHasCalendar === 'true') {
        setHasCalendar(true);
        setAppState('split-screen');
      } else {
        setAppState('chat-only');
      }
    }

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedChats) setChatSessions(JSON.parse(savedChats));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('planelope_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('planelope_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('planelope_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('planelope_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('planelope_has_calendar', hasCalendar.toString());
  }, [hasCalendar]);

  const handleStartScheduling = () => {
    setShowSignInModal(true);
  };

  const handleSignIn = (method: 'email' | 'google' | 'microsoft' | 'guest', email?: string) => {
    let newUser: User;
    
    if (method === 'guest') {
      newUser = {
        name: 'Guest',
        email: 'guest@planelope.com',
        isGuest: true,
      };
    } else if (method === 'email' && email) {
      newUser = {
        name: email.split('@')[0],
        email: email,
        isGuest: false,
      };
    } else if (method === 'google') {
      newUser = {
        name: 'Google User',
        email: 'user@gmail.com',
        isGuest: false,
      };
    } else if (method === 'microsoft') {
      newUser = {
        name: 'Microsoft User',
        email: 'user@outlook.com',
        isGuest: false,
      };
    } else {
      return;
    }

    setUser(newUser);
    setShowSignInModal(false);
    setShowSignUpModal(false);
    
    // Start with chat-only experience
    setAppState('chat-only');
    
    // Create initial chat session
    const initialChat: ChatSession = {
      id: Date.now().toString(),
      name: 'Getting Started',
      date: new Date().toISOString(),
      messages: [{
        id: '1',
        role: 'assistant',
        content: "Hi! I'm PLANelope, your AI scheduling assistant and second brain. I'm here to help you build and manage your schedule intentionally.\n\nLet's start by understanding your commitments. What does your week look like? Tell me about:\n• Classes or work schedule\n• Upcoming deadlines\n• Regular commitments\n• Goals you're working toward",
        timestamp: new Date(),
      }],
    };
    
    setChatSessions([initialChat]);
    setCurrentChatId(initialChat.id);
  };

  const handleSignUp = (email: string, password: string) => {
    // For now, treat sign up same as sign in
    handleSignIn('email', email);
  };

  const handleLogOut = () => {
    setUser(null);
    setAppState('landing');
    setChatSessions([]);
    setCurrentChatId(null);
    setTasks([]);
    setGoals([]);
    setHasCalendar(false);
    
    // Clear localStorage
    localStorage.removeItem('planelope_user');
    localStorage.removeItem('planelope_tasks');
    localStorage.removeItem('planelope_goals');
    localStorage.removeItem('planelope_chats');
    localStorage.removeItem('planelope_has_calendar');
  };

  const handleConnectCalendar = (provider: 'google' | 'outlook') => {
    console.log(`Connecting to ${provider} calendar...`);
    // Simulate calendar connection
    setHasCalendar(true);
    setAppState('split-screen');
    
    // Add system message to chat
    if (currentChatId) {
      const updatedSessions = chatSessions.map(session => {
        if (session.id === currentChatId) {
          return {
            ...session,
            messages: [
              ...session.messages,
              {
                id: Date.now().toString(),
                role: 'assistant' as const,
                content: `Great! I've connected your ${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar. I can now see your existing events and help you optimize your schedule. What would you like to work on?`,
                timestamp: new Date(),
              }
            ]
          };
        }
        return session;
      });
      setChatSessions(updatedSessions);
    }
  };

  const handleInputCalendar = () => {
    setHasCalendar(true);
    setAppState('split-screen');
    
    // Add system message to chat
    if (currentChatId) {
      const updatedSessions = chatSessions.map(session => {
        if (session.id === currentChatId) {
          return {
            ...session,
            messages: [
              ...session.messages,
              {
                id: Date.now().toString(),
                role: 'assistant' as const,
                content: "Perfect! You can now manually add events to your calendar using the + buttons, or just tell me about your commitments and I'll add them for you. What would you like to schedule first?",
                timestamp: new Date(),
              }
            ]
          };
        }
        return session;
      });
      setChatSessions(updatedSessions);
    }
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

  const handleOpenEventForm = (date: string) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Chat ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      messages: [{
        id: '1',
        role: 'assistant',
        content: "Hi! What would you like to work on today?",
        timestamp: new Date(),
      }],
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentChatId(newSession.id);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleRenameChat = (chatId: string, newName: string) => {
    setChatSessions(chatSessions.map(session => 
      session.id === chatId ? { ...session, name: newName } : session
    ));
  };

  const handleSendMessage = (message: string) => {
    if (!currentChatId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Update chat with user message
    const updatedSessions = chatSessions.map(session => {
      if (session.id === currentChatId) {
        return {
          ...session,
          messages: [...session.messages, userMessage]
        };
      }
      return session;
    });
    setChatSessions(updatedSessions);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand! Let me help you with that. Could you tell me more about when you'd prefer to work on this, and how much time you think you'll need?",
        timestamp: new Date(),
      };

      const finalSessions = chatSessions.map(session => {
        if (session.id === currentChatId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, aiMessage]
          };
        }
        return session;
      });
      setChatSessions(finalSessions);
    }, 1500);
  };

  const handleAnalyzeSchedule = () => {
    if (!currentChatId) return;

    const analysisMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `📊 **Schedule Analysis**

**Productivity Score: 78/100**

**Workload Balance:**
• Monday-Wednesday: Well balanced ✓
• Thursday-Friday: Slightly overbooked ⚠️
• Weekend: Good recovery time ✓

**Key Insights:**
1. You have 3 hours of focus time on Tuesday morning - perfect for deep work
2. Thursday has back-to-back commitments - consider adding buffer time
3. Your BUS105 report deadline is Friday, but you haven't scheduled work time yet

**Suggestions:**
• Move "Study for midterm" from Thursday 2pm to Tuesday 9am (better focus time)
• Block Friday 10am-1pm for BUS105 report (before deadline)
• Add 15-minute buffers between Thursday meetings

Would you like me to apply these changes?`,
      timestamp: new Date(),
    };

    const updatedSessions = chatSessions.map(session => {
      if (session.id === currentChatId) {
        return {
          ...session,
          messages: [...session.messages, analysisMessage]
        };
      }
      return session;
    });
    setChatSessions(updatedSessions);
  };

  const currentChat = chatSessions.find(s => s.id === currentChatId);
  const scheduledTasks = tasks.filter(t => t.date);

  const renderContent = () => {
    if (appState === 'landing') {
      return <LandingPage onStartScheduling={handleStartScheduling} />;
    }

    if (appState === 'chat-only') {
      return (
        <ChatInterface
          messages={currentChat?.messages || []}
          onSendMessage={handleSendMessage}
          onConnectCalendar={handleConnectCalendar}
          onInputCalendar={handleInputCalendar}
          showCalendarButtons={true}
          isFullWidth={true}
        />
      );
    }

    if (appState === 'split-screen') {
      return (
        <div className="h-full flex flex-col lg:flex-row">
          {/* Chat Panel - Left Side */}
          <div className="lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200">
            <ChatInterface
              messages={currentChat?.messages || []}
              onSendMessage={handleSendMessage}
              showCalendarButtons={false}
              isFullWidth={false}
            />
          </div>

          {/* Calendar Panel - Right Side */}
          <div className="lg:w-1/2 h-1/2 lg:h-full overflow-auto relative">
            <div className="p-6">
              <Calendar
                scheduledTasks={scheduledTasks}
                onAddTask={handleOpenEventForm}
                onRemoveTask={handleRemoveTask}
                categories={categories}
              />
            </div>

            {/* Sticky Analyze Button */}
            <button
              onClick={handleAnalyzeSchedule}
              className="fixed bottom-24 lg:bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analyze My Schedule
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar - Only show when user is signed in */}
      {user && (
        <Sidebar
          user={user}
          chatSessions={chatSessions}
          currentChatId={currentChatId}
          onSignIn={() => setShowSignInModal(true)}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onRenameChat={handleRenameChat}
          onSettings={() => alert('Settings coming soon!')}
          onAppearance={() => alert('Appearance settings coming soon!')}
          onLogOut={handleLogOut}
          onSwitchAccount={() => alert('Account switching coming soon!')}
        />
      )}
      
      {/* Main Content Area */}
      <div className={`flex-1 ${user ? 'lg:ml-20' : ''} overflow-hidden`}>
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
          onAddCategory={(category) => {
            const newCategory: Category = {
              ...category,
              id: Date.now().toString(),
            };
            setCategories([...categories, newCategory]);
          }}
        />
      )}

      {showSignInModal && (
        <SignInModal
          onClose={() => setShowSignInModal(false)}
          onSignIn={handleSignIn}
          onShowSignUp={() => {
            setShowSignInModal(false);
            setShowSignUpModal(true);
          }}
        />
      )}

      {showSignUpModal && (
        <SignInModal
          onClose={() => setShowSignUpModal(false)}
          onSignIn={handleSignIn}
          onShowSignUp={() => {}}
          isSignUp={true}
        />
      )}
    </div>
  );
}

export default App;
