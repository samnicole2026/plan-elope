import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Calendar, FileText, X, Minimize2, Maximize2, ChevronsRight } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { CalendarConnect } from './CalendarConnect';
import { Calendar as CalendarView } from './Calendar';
import { Category } from '../types';

interface SplitScreenOnboardingProps {
  initialView?: 'onboarding' | 'chat' | 'connect';
  onClose: () => void;
  onChatWithPlanelope: () => void;
  onConnectCalendar: () => void;
  onInputCalendar: () => void;
  categories: Category[];
}

type PanelState = 'normal' | 'minimized' | 'fullscreen';
type UserPath = 'none' | 'chat-first' | 'calendar-first';

export const SplitScreenOnboarding: React.FC<SplitScreenOnboardingProps> = ({
  initialView = 'onboarding',
  onClose,
  onChatWithPlanelope,
  onConnectCalendar,
  onInputCalendar,
  categories,
}) => {
  const [currentView, setCurrentView] = useState<'onboarding' | 'chat' | 'connect' | 'calendar'>(initialView);
  const [userPath, setUserPath] = useState<UserPath>('none');
  const [panelState, setPanelState] = useState<PanelState>('normal');
  const [rightPanelWidth, setRightPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((containerRect.right - e.clientX) / containerRect.width) * 100;
      
      const constrainedWidth = Math.max(20, Math.min(80, newWidth));
      setRightPanelWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMinimize = () => {
    setPanelState(panelState === 'minimized' ? 'normal' : 'minimized');
  };

  const handleFullscreen = () => {
    setPanelState(panelState === 'fullscreen' ? 'normal' : 'fullscreen');
  };

  const handleChatClick = () => {
    setUserPath('chat-first');
    setCurrentView('chat');
    setRightPanelWidth(30); // Chat takes 70%, calendar takes 30%
    onChatWithPlanelope();
  };

  const handleConnectClick = () => {
    setUserPath('calendar-first');
    setCurrentView('connect');
    setRightPanelWidth(50);
    onConnectCalendar();
  };

  const handleInputClick = () => {
    setUserPath('calendar-first');
    onInputCalendar();
  };

  const handleCalendarConnected = () => {
    // After calendar is connected, show chat on the left
    setCurrentView('chat');
    setRightPanelWidth(30);
  };

  const getLeftPanelStyle = () => {
    if (panelState === 'minimized') return { width: '100%' };
    if (panelState === 'fullscreen') return { width: '0%', display: 'none' };
    return { width: `${100 - rightPanelWidth}%` };
  };

  const getRightPanelStyle = () => {
    if (panelState === 'minimized') return { width: '0%', display: 'none' };
    if (panelState === 'fullscreen') return { width: '100%' };
    return { width: `${rightPanelWidth}%` };
  };

  const renderLeftPanel = () => {
    // Initial state: Show chat option
    if (userPath === 'none') {
      return (
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 flex items-center justify-center h-full">
          <button
            onClick={handleChatClick}
            className="w-full max-w-md bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-8 rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">Chat with PLANelope</h3>
                <p className="text-indigo-100 text-lg">
                  Build your calendar from scratch through conversation
                </p>
              </div>
            </div>
          </button>
        </div>
      );
    }

    // Chat-first path OR Calendar-first path (after calendar setup)
    if (currentView === 'chat') {
      return (
        <div className="h-full bg-white">
          <ChatInterface onClose={onClose} isEmbedded />
        </div>
      );
    }

    // Calendar-first path: Show blank state while user sets up calendar
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Setting up your calendar...
          </h3>
          <p className="text-gray-600 text-lg">
            Once connected, you can chat with PLANelope about optimizing your schedule
          </p>
        </div>
      </div>
    );
  };

  const renderRightPanel = () => {
    // Initial state: Show calendar options
    if (userPath === 'none') {
      return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex items-center justify-center h-full">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Calendar
              </h3>
              <p className="text-gray-600">Choose how you'd like to set up your calendar</p>
            </div>

            <button
              onClick={handleConnectClick}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1">Connect Your Calendar</h4>
                  <p className="text-sm text-purple-100">
                    Sync with Google or Outlook Calendar
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={handleInputClick}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-1">Input Your Calendar</h4>
                  <p className="text-sm text-pink-100">
                    Manually add your events and commitments
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      );
    }

    // Chat-first path: Show blank calendar
    if (userPath === 'chat-first') {
      return (
        <div className="h-full bg-white overflow-auto">
          <div className="p-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl mb-6">
              <h3 className="text-xl font-semibold">Your Calendar</h3>
              <p className="text-sm text-indigo-100">Build your schedule through conversation</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Your calendar is empty
                </h4>
                <p className="text-gray-600">
                  Chat with PLANelope to start building your schedule
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Calendar-first path: Show calendar connection
    if (currentView === 'connect') {
      return (
        <div className="h-full bg-white">
          <CalendarConnect 
            onClose={() => {
              setUserPath('none');
              setCurrentView('onboarding');
            }} 
            onConnect={(provider) => {
              console.log(`Connecting to ${provider}...`);
              handleCalendarConnected();
            }}
            isEmbedded 
          />
        </div>
      );
    }

    // After calendar is connected in calendar-first path
    return (
      <div className="h-full bg-white overflow-auto">
        <div className="p-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl mb-6">
            <h3 className="text-xl font-semibold">Your Calendar</h3>
            <p className="text-sm text-purple-100">Connected and ready to optimize</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Calendar Connected!
              </h4>
              <p className="text-gray-600">
                Now chat with PLANelope to optimize your schedule
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-2xl font-semibold">Get Started with Plan-elope</h2>
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Split Screen Content */}
      <div ref={containerRef} className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Left Panel */}
        <div 
          className="transition-all duration-300 overflow-auto"
          style={getLeftPanelStyle()}
        >
          {renderLeftPanel()}
        </div>

        {/* Resize Handle - Only show when both panels are active */}
        {panelState === 'normal' && userPath !== 'none' && (
          <div
            className="hidden md:block absolute top-0 bottom-0 w-1 bg-gray-300 hover:bg-indigo-500 cursor-col-resize z-10 transition-colors"
            style={{ left: `${100 - rightPanelWidth}%` }}
            onMouseDown={() => setIsDragging(true)}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-gray-400 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-4 bg-white rounded"></div>
                <div className="w-0.5 h-4 bg-white rounded"></div>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel */}
        <div 
          className="relative transition-all duration-300 overflow-auto"
          style={getRightPanelStyle()}
        >
          {/* Control Buttons - Only show when both panels are active */}
          {userPath !== 'none' && (
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <button
                onClick={handleMinimize}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-lg shadow-md transition-all hover:shadow-lg"
                title={panelState === 'minimized' ? 'Restore' : 'Minimize'}
              >
                {panelState === 'minimized' ? (
                  <ChevronsRight className="w-5 h-5 text-purple-600" />
                ) : (
                  <Minimize2 className="w-5 h-5 text-purple-600" />
                )}
              </button>
              <button
                onClick={handleFullscreen}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-lg shadow-md transition-all hover:shadow-lg"
                title={panelState === 'fullscreen' ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                <Maximize2 className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          )}

          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
};
