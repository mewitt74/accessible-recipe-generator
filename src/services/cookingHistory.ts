/**
 * Cooking History Service
 * Track which recipes the user has made, when, and how often
 */

export interface CookingSession {
  recipeTitle: string;
  recipeId?: string;
  date: string; // ISO date string
  completedSteps: number;
  totalSteps: number;
  completed: boolean;
  rating?: number; // 1-5 stars
  notes?: string;
  duration?: number; // minutes
}

export interface CookingStats {
  totalRecipesCooked: number;
  uniqueRecipes: number;
  totalCookingSessions: number;
  completionRate: number; // percentage
  averageRating: number;
  favoriteRecipes: string[]; // most cooked
  recentRecipes: string[];
  streakDays: number;
  lastCookingDate: string | null;
  thisWeekCount: number;
  thisMonthCount: number;
}

export interface RecipeProgress {
  recipeTitle: string;
  timesStarted: number;
  timesCompleted: number;
  lastCooked: string | null;
  averageRating: number;
  bestTime?: number; // fastest completion in minutes
}

const STORAGE_KEY = 'cooking_history';
const MAX_HISTORY_ENTRIES = 100;

/**
 * Get all cooking history
 */
export function getCookingHistory(): CookingSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load cooking history:', error);
    return [];
  }
}

/**
 * Save cooking history
 */
function saveCookingHistory(history: CookingSession[]): void {
  try {
    // Keep only the most recent entries
    const trimmed = history.slice(-MAX_HISTORY_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save cooking history:', error);
  }
}

/**
 * Start a new cooking session
 */
export function startCookingSession(
  recipeTitle: string,
  totalSteps: number,
  recipeId?: string
): CookingSession {
  const session: CookingSession = {
    recipeTitle,
    recipeId,
    date: new Date().toISOString(),
    completedSteps: 0,
    totalSteps,
    completed: false,
  };

  const history = getCookingHistory();
  history.push(session);
  saveCookingHistory(history);

  return session;
}

/**
 * Update progress in current session
 */
export function updateSessionProgress(
  recipeTitle: string,
  completedSteps: number
): void {
  const history = getCookingHistory();
  const today = new Date().toDateString();

  // Find today's session for this recipe
  const sessionIndex = history.findIndex(
    s => s.recipeTitle === recipeTitle && 
         new Date(s.date).toDateString() === today &&
         !s.completed
  );

  if (sessionIndex >= 0) {
    history[sessionIndex].completedSteps = completedSteps;
    saveCookingHistory(history);
  }
}

/**
 * Complete a cooking session
 */
export function completeCookingSession(
  recipeTitle: string,
  rating?: number,
  notes?: string,
  durationMinutes?: number
): void {
  const history = getCookingHistory();
  const today = new Date().toDateString();

  // Find today's incomplete session for this recipe
  const sessionIndex = history.findIndex(
    s => s.recipeTitle === recipeTitle && 
         new Date(s.date).toDateString() === today &&
         !s.completed
  );

  if (sessionIndex >= 0) {
    history[sessionIndex].completed = true;
    history[sessionIndex].completedSteps = history[sessionIndex].totalSteps;
    if (rating !== undefined) history[sessionIndex].rating = rating;
    if (notes) history[sessionIndex].notes = notes;
    if (durationMinutes) history[sessionIndex].duration = durationMinutes;
    saveCookingHistory(history);
  }
}

/**
 * Add rating to a session
 */
export function rateSession(recipeTitle: string, rating: number): void {
  const history = getCookingHistory();

  // Find the most recent completed session for this recipe
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].recipeTitle === recipeTitle && history[i].completed) {
      history[i].rating = rating;
      saveCookingHistory(history);
      break;
    }
  }
}

/**
 * Get cooking statistics
 */
export function getCookingStats(): CookingStats {
  const history = getCookingHistory();
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate unique recipes
  const uniqueRecipeSet = new Set(history.map(s => s.recipeTitle));
  const uniqueRecipes = uniqueRecipeSet.size;

  // Calculate completion rate
  const completedSessions = history.filter(s => s.completed);
  const completionRate = history.length > 0 
    ? Math.round((completedSessions.length / history.length) * 100) 
    : 0;

  // Calculate average rating
  const ratedSessions = completedSessions.filter(s => s.rating !== undefined);
  const averageRating = ratedSessions.length > 0
    ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length
    : 0;

  // Find favorite recipes (most cooked)
  const recipeCounts: { [key: string]: number } = {};
  completedSessions.forEach(s => {
    recipeCounts[s.recipeTitle] = (recipeCounts[s.recipeTitle] || 0) + 1;
  });
  const favoriteRecipes = Object.entries(recipeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([title]) => title);

  // Recent recipes
  const recentRecipes = [...new Set(
    history
      .slice(-10)
      .reverse()
      .map(s => s.recipeTitle)
  )].slice(0, 5);

  // Calculate streak
  const streakDays = calculateStreak(history);

  // Last cooking date
  const lastSession = history.length > 0 ? history[history.length - 1] : null;
  const lastCookingDate = lastSession ? lastSession.date : null;

  // This week/month counts
  const thisWeekCount = history.filter(
    s => new Date(s.date) >= oneWeekAgo && s.completed
  ).length;
  const thisMonthCount = history.filter(
    s => new Date(s.date) >= oneMonthAgo && s.completed
  ).length;

  return {
    totalRecipesCooked: completedSessions.length,
    uniqueRecipes,
    totalCookingSessions: history.length,
    completionRate,
    averageRating: Math.round(averageRating * 10) / 10,
    favoriteRecipes,
    recentRecipes,
    streakDays,
    lastCookingDate,
    thisWeekCount,
    thisMonthCount,
  };
}

/**
 * Calculate cooking streak (consecutive days)
 */
function calculateStreak(history: CookingSession[]): number {
  if (history.length === 0) return 0;

  const completedDates = [...new Set(
    history
      .filter(s => s.completed)
      .map(s => new Date(s.date).toDateString())
  )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (completedDates.length === 0) return 0;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  // Check if streak is still active
  if (completedDates[0] !== today && completedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < completedDates.length; i++) {
    const currentDate = new Date(completedDates[i - 1]);
    const prevDate = new Date(completedDates[i]);
    const diffDays = Math.round(
      (currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get progress for a specific recipe
 */
export function getRecipeProgress(recipeTitle: string): RecipeProgress {
  const history = getCookingHistory();
  const recipeSessions = history.filter(s => s.recipeTitle === recipeTitle);

  const completedSessions = recipeSessions.filter(s => s.completed);
  const ratedSessions = completedSessions.filter(s => s.rating !== undefined);
  const timedSessions = completedSessions.filter(s => s.duration !== undefined);

  return {
    recipeTitle,
    timesStarted: recipeSessions.length,
    timesCompleted: completedSessions.length,
    lastCooked: completedSessions.length > 0 
      ? completedSessions[completedSessions.length - 1].date 
      : null,
    averageRating: ratedSessions.length > 0
      ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length
      : 0,
    bestTime: timedSessions.length > 0
      ? Math.min(...timedSessions.map(s => s.duration!))
      : undefined,
  };
}

/**
 * Clear all cooking history
 */
export function clearCookingHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Format date for display
 */
export function formatCookingDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
}

/**
 * Get achievement badges based on history
 */
export function getAchievements(stats: CookingStats): { icon: string; title: string; earned: boolean }[] {
  return [
    { icon: '👨‍🍳', title: 'First Recipe', earned: stats.totalRecipesCooked >= 1 },
    { icon: '🌟', title: '5 Recipes', earned: stats.totalRecipesCooked >= 5 },
    { icon: '🏆', title: '10 Recipes', earned: stats.totalRecipesCooked >= 10 },
    { icon: '👑', title: '25 Recipes', earned: stats.totalRecipesCooked >= 25 },
    { icon: '🔥', title: '3-Day Streak', earned: stats.streakDays >= 3 },
    { icon: '💪', title: '7-Day Streak', earned: stats.streakDays >= 7 },
    { icon: '🎯', title: 'Consistent Chef', earned: stats.completionRate >= 80 },
    { icon: '⭐', title: 'Quality Cook', earned: stats.averageRating >= 4 },
    { icon: '🍳', title: 'Variety Chef', earned: stats.uniqueRecipes >= 5 },
    { icon: '📚', title: 'Recipe Explorer', earned: stats.uniqueRecipes >= 10 },
  ];
}
