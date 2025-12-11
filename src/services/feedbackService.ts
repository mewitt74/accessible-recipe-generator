/**
 * Feedback Service
 * Report issues, rate recipes, and provide feedback
 */

export interface RecipeRating {
  recipeId: string;
  recipeName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  difficulty: 'too-easy' | 'just-right' | 'too-hard';
  wouldMakeAgain: boolean;
  comment?: string;
  timestamp: number;
}

export interface FeedbackReport {
  id: string;
  type: 'bug' | 'suggestion' | 'accessibility' | 'recipe-issue' | 'other';
  description: string;
  recipeId?: string;
  recipeName?: string;
  severity?: 'low' | 'medium' | 'high';
  contact?: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface AppSurvey {
  easeOfUse: 1 | 2 | 3 | 4 | 5;
  accessibility: 1 | 2 | 3 | 4 | 5;
  wouldRecommend: boolean;
  favoriteFeature?: string;
  improvementSuggestion?: string;
  timestamp: number;
}

const RATINGS_KEY = 'recipeRatings';
const FEEDBACK_KEY = 'feedbackReports';
const SURVEY_KEY = 'appSurveys';

// ============ Recipe Ratings ============

/**
 * Get all recipe ratings
 */
export function getRecipeRatings(): RecipeRating[] {
  try {
    const stored = localStorage.getItem(RATINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Get rating for a specific recipe
 */
export function getRecipeRating(recipeId: string): RecipeRating | null {
  const ratings = getRecipeRatings();
  return ratings.find(r => r.recipeId === recipeId) || null;
}

/**
 * Save a recipe rating
 */
export function saveRecipeRating(rating: Omit<RecipeRating, 'timestamp'>): void {
  const ratings = getRecipeRatings();
  
  // Remove existing rating for this recipe
  const filtered = ratings.filter(r => r.recipeId !== rating.recipeId);
  
  filtered.push({
    ...rating,
    timestamp: Date.now(),
  });
  
  localStorage.setItem(RATINGS_KEY, JSON.stringify(filtered));
}

/**
 * Get average rating for a recipe
 */
export function getAverageRating(recipeId: string): number {
  const rating = getRecipeRating(recipeId);
  return rating?.rating || 0;
}

/**
 * Get top rated recipes
 */
export function getTopRatedRecipes(limit: number = 5): RecipeRating[] {
  const ratings = getRecipeRatings();
  return ratings
    .filter(r => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// ============ Feedback Reports ============

/**
 * Get all feedback reports
 */
export function getFeedbackReports(): FeedbackReport[] {
  try {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Submit a feedback report
 */
export function submitFeedback(report: Omit<FeedbackReport, 'id' | 'timestamp' | 'status'>): FeedbackReport {
  const reports = getFeedbackReports();
  
  const newReport: FeedbackReport = {
    ...report,
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    status: 'pending',
  };
  
  reports.push(newReport);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(reports));
  
  return newReport;
}

/**
 * Get pending feedback count
 */
export function getPendingFeedbackCount(): number {
  return getFeedbackReports().filter(r => r.status === 'pending').length;
}

// ============ App Surveys ============

/**
 * Get all surveys
 */
export function getSurveys(): AppSurvey[] {
  try {
    const stored = localStorage.getItem(SURVEY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Submit app survey
 */
export function submitSurvey(survey: Omit<AppSurvey, 'timestamp'>): void {
  const surveys = getSurveys();
  surveys.push({
    ...survey,
    timestamp: Date.now(),
  });
  localStorage.setItem(SURVEY_KEY, JSON.stringify(surveys));
}

/**
 * Check if user has completed a survey recently (within 30 days)
 */
export function hasRecentSurvey(): boolean {
  const surveys = getSurveys();
  if (surveys.length === 0) return false;
  
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return surveys.some(s => s.timestamp > thirtyDaysAgo);
}

// ============ Feedback Types ============

export const FEEDBACK_TYPES: { type: FeedbackReport['type']; label: string; emoji: string }[] = [
  { type: 'bug', label: 'Something is broken', emoji: '🐛' },
  { type: 'suggestion', label: 'Feature suggestion', emoji: '💡' },
  { type: 'accessibility', label: 'Accessibility issue', emoji: '♿' },
  { type: 'recipe-issue', label: 'Problem with a recipe', emoji: '📝' },
  { type: 'other', label: 'Other feedback', emoji: '💬' },
];

/**
 * Get feedback type info
 */
export function getFeedbackTypeInfo(type: FeedbackReport['type']) {
  return FEEDBACK_TYPES.find(t => t.type === type);
}

// ============ Rating UI Helpers ============

/**
 * Get star display for rating
 */
export function getStarDisplay(rating: number): string {
  const filled = '⭐';
  const empty = '☆';
  return filled.repeat(rating) + empty.repeat(5 - rating);
}

/**
 * Get difficulty label
 */
export function getDifficultyLabel(difficulty: RecipeRating['difficulty']): string {
  const labels: Record<RecipeRating['difficulty'], string> = {
    'too-easy': 'Too Easy',
    'just-right': 'Just Right',
    'too-hard': 'Too Difficult',
  };
  return labels[difficulty];
}

// ============ Quick Feedback ============

/**
 * Quick thumbs up/down for a recipe
 */
export function quickRate(recipeId: string, recipeName: string, isPositive: boolean): void {
  saveRecipeRating({
    recipeId,
    recipeName,
    rating: isPositive ? 5 : 2,
    difficulty: 'just-right',
    wouldMakeAgain: isPositive,
  });
}

/**
 * Report a recipe issue quickly
 */
export function quickReportIssue(recipeId: string, recipeName: string, issue: string): FeedbackReport {
  return submitFeedback({
    type: 'recipe-issue',
    description: issue,
    recipeId,
    recipeName,
    severity: 'medium',
  });
}

// ============ Export Feedback ============

/**
 * Export all feedback as JSON (for debugging/support)
 */
export function exportFeedbackData(): string {
  const data = {
    ratings: getRecipeRatings(),
    feedback: getFeedbackReports(),
    surveys: getSurveys(),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Get feedback summary
 */
export function getFeedbackSummary(): {
  totalRatings: number;
  averageRating: number;
  totalFeedback: number;
  pendingFeedback: number;
} {
  const ratings = getRecipeRatings();
  const feedback = getFeedbackReports();
  
  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;
  
  return {
    totalRatings: ratings.length,
    averageRating: Math.round(avgRating * 10) / 10,
    totalFeedback: feedback.length,
    pendingFeedback: feedback.filter(f => f.status === 'pending').length,
  };
}
