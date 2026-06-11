import React, { useState } from 'react';
import { 
  Calendar, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  User,
  Settings,
  Palette,
  LogOut,
  Users,
  CalendarDays
} from 'lucide-react';

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

interface SidebarProps {
  user: User | null;
  chatSessions: ChatSession[];
  onSignIn: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onCalendars: () => void;
  onSettings: () => void;
  onAppearance: () => void;
  onLogOut: () => void;
  onSwitchAccount: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  chatSessions,
  onSignIn,
  onNewChat,
  onSelectChat,
  onCalendars,
  onSettings,
  onAppearance,
  onLogOut,
  onSwitchAccount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const NavItem = ({ 
    icon: Icon, 
    label, 
    onClick 
  }: { 
    icon: React.ElementType; 
    label: string; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all rounded-lg group relative"
      title={!isExpanded ? label : undefined}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {isExpanded && <span className="font-medium">{label}</span>}
      {!isExpanded && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} h-screen fixed left-0 top-0 z-40`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors shadow-md"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-indigo-600 flex-shrink-0" />
            {isExpanded && (
              <span className="text-xl font-bold text-gray-900">Plan-elope</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2 px-2">
          <NavItem icon={Calendar} label="Calendars" onClick={onCalendars} />
          <NavItem icon={MessageSquare} label="New Chat" onClick={onNewChat} />

          {/* Recents Section */}
          {chatSessions.length > 0 && (
            <div className="pt-4">
              {isExpanded && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Recents
                </div>
              )}
              <div className="space-y-1">
                {chatSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => onSelectChat(session.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all rounded-lg group relative"
                    title={!isExpanded ? session.name : undefined}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    {isExpanded && (
                      <span className="truncate">{session.name}</span>
                    )}
                    {!isExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {session.name}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="border-t border-gray-200 p-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {isExpanded && (
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {user.name}
                    </div>
                    {user.isGuest && (
                      <div className="text-xs text-gray-500">Guest</div>
                    )}
                  </div>
                )}
              </button>

              {showProfileMenu && isExpanded && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => {
                      onSettings();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      onAppearance();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Palette className="w-4 h-4" />
                    Appearance
                  </button>
                  <button
                    onClick={() => {
                      onSwitchAccount();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Users className="w-4 h-4" />
                    Switch Account
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      onLogOut();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium"
              title={!isExpanded ? 'Sign In' : undefined}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {isExpanded && <span>Sign In</span>}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={onCalendars}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-indigo-600"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Calendars</span>
          </button>
          <button
            onClick={onNewChat}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-indigo-600"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs">New Chat</span>
          </button>
          <button
            onClick={user ? () => setShowProfileMenu(!showProfileMenu) : onSignIn}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-indigo-600"
          >
            {user ? (
              <>
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs">Profile</span>
              </>
            ) : (
              <>
                <User className="w-6 h-6" />
                <span className="text-xs">Sign In</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Profile Menu */}
        {showProfileMenu && user && (
          <div className="absolute bottom-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  onSettings();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button
                onClick={() => {
                  onAppearance();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Palette className="w-5 h-5" />
                Appearance
              </button>
              <button
                onClick={() => {
                  onSwitchAccount();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Users className="w-5 h-5" />
                Switch Account
              </button>
              <button
                onClick={() => {
                  onLogOut();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
