export interface Task {
  id: string;
  name: string;
  date?: string;
  time?: string;
  allDay?: boolean;
  importance: number;
  categoryId: string;
  movable: boolean;
  immovable: boolean;
  lockedIn: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'short-term' | 'long-term';
  targetDate?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ScheduleSuggestion {
  taskId: string;
  taskName: string;
  suggestedDate: string;
  suggestedTime: string;
  reason: string;
}

export interface AIAnalysisResult {
  suggestions: ScheduleSuggestion[];
  efficiency: number;
  feasibility: number;
  conflicts: string[];
}
