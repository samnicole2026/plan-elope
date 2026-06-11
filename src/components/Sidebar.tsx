import React, { useState } from 'react';
import { 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  User,
  Settings,
  Palette,
  LogOut,
  Users,
  CalendarDays,
  Edit2,
  Check,
  X
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
  currentChatId: string | null;
  onSignIn: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newName: string) => void;
  onSettings: () => void;
  onAppearance: () => void;
  onLogOut: () => void;
  onSwitchAccount: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  chatSessions,
  currentChatId,
  onSignIn,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onSettings,
  onAppearance,
  onLogOut,
  onSwitchAccount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (chatId: string, currentName: string) => {
    setEditingChatId(chatId);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (editingChatId && editingName.trim()) {
      onRenameChat(editingChatId, editingName.trim());
    }
    setEditingChatId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingChatId(null);
    setEditingName('');
  };

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
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            {isExpanded && (
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Plan-elope
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2 px-2">
          <NavItem icon={MessageSquare} label="New Chat" onClick={onNewChat} />

          {/* Recents Section */}
          {chatSessions.length > 0 && (
            <div className="pt-4">
              {isExpanded && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Recent Chats
                </div>
              )}
              <div className="space-y-1">
                {chatSessions.map((session) => (
                  <div key={session.id} className="relative group">
                    {editingChatId === session.id ? (
                      <div className="flex items-center gap-2 px-4 py-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectChat(session.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all rounded-lg group/item relative ${
                          currentChatId === session.id
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                        title={!isExpanded ? session.name : undefined}
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        {isExpanded && (
                          <>
                            <span className="truncate flex-1 text-left">{session.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(session.id, session.name);
                              }}
                              className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-indigo-100 rounded transition-opacity"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                        {!isExpanded && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                            {session.name}
                          </div>
                        )}
                      </button>
                    )}
                  </div>
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
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {isExpanded && (
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {user.isGuest ? 'Sign In' : user.name}
                    </div>
                    {!user.isGuest && (
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    )}
                  </div>
                )}
              </button>

              {showProfileMenu && isExpanded && !user.isGuest && (
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

              {showProfileMenu && isExpanded && user.isGuest && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => {
                      onSignIn();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-semibold"
                  >
                    <User className="w-4 h-4" />
                    Sign In / Sign Up
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
                    Exit Guest Mode
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
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
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs">{user.isGuest ? 'Sign In' : 'Profile'}</span>
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
              {!user.isGuest ? (
                <>
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
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onSignIn();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold"
                  >
                    <User className="w-5 h-5" />
                    Sign In / Sign Up
                  </button>
                  <button
                    onClick={() => {
                      onLogOut();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    Exit Guest Mode
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
