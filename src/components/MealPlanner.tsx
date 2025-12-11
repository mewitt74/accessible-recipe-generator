/**
 * Meal Planner Component
 * Visual weekly meal planning calendar
 */

import { useState } from 'react';
import type { Recipe } from '../types';
import {
  type PlannedMeal,
  getWeekMeals,
  getWeekDates,
  getWeekStart,
  addRecipeToPlan,
  removeMealFromPlan,
  toggleMealCompleted,
  getMealTypeEmoji,
  getMealTypeLabel,
} from '../services/mealPlanning';

interface MealPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecipe?: Recipe | null;
}

const MEAL_TYPES: PlannedMeal['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealPlanner({
  isOpen,
  onClose,
  currentRecipe,
}: MealPlannerProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<PlannedMeal['mealType']>('dinner');
  const [showAddModal, setShowAddModal] = useState(false);
  
  if (!isOpen) return null;
  
  // Calculate current week start based on offset
  const today = new Date();
  today.setDate(today.getDate() + weekOffset * 7);
  const weekStart = getWeekStart(today);
  
  const weekDates = getWeekDates(weekStart);
  const meals = getWeekMeals(weekStart);
  
  // Navigate weeks
  const goToPrevWeek = () => setWeekOffset(prev => prev - 1);
  const goToNextWeek = () => setWeekOffset(prev => prev + 1);
  const goToThisWeek = () => setWeekOffset(0);
  
  // Get meals for a specific day and type
  const getMealsFor = (date: string, mealType: PlannedMeal['mealType']) => {
    return meals.filter(m => m.date === date && m.mealType === mealType);
  };
  
  // Handle adding current recipe to plan
  const handleAddToPlan = () => {
    if (currentRecipe && selectedDay) {
      addRecipeToPlan(currentRecipe, selectedDay, selectedMealType);
      setShowAddModal(false);
      setSelectedDay(null);
    }
  };
  
  // Handle cell click to add meal
  const handleCellClick = (date: string, mealType: PlannedMeal['mealType']) => {
    if (currentRecipe) {
      setSelectedDay(date);
      setSelectedMealType(mealType);
      setShowAddModal(true);
    }
  };
  
  // Handle removing a meal
  const handleRemoveMeal = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this meal from your plan?')) {
      removeMealFromPlan(mealId);
      // Force re-render
      setWeekOffset(prev => prev);
    }
  };
  
  // Handle toggling meal completion
  const handleToggleComplete = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMealCompleted(mealId);
    // Force re-render
    setWeekOffset(prev => prev);
  };
  
  // Format week range for display
  const formatWeekRange = () => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString(undefined, opts)} - ${end.toLocaleDateString(undefined, opts)}`;
  };
  
  return (
    <div className="meal-planner-overlay" onClick={onClose}>
      <div className="meal-planner-modal" onClick={e => e.stopPropagation()}>
        <div className="meal-planner-header">
          <h2>📅 Meal Planner</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        
        {/* Week Navigation */}
        <div className="week-navigation">
          <button onClick={goToPrevWeek} className="week-nav-btn" aria-label="Previous week">
            ◀️ Prev
          </button>
          <div className="week-display">
            <span className="week-range">{formatWeekRange()}</span>
            {weekOffset !== 0 && (
              <button onClick={goToThisWeek} className="today-btn">
                Today
              </button>
            )}
          </div>
          <button onClick={goToNextWeek} className="week-nav-btn" aria-label="Next week">
            Next ▶️
          </button>
        </div>
        
        {/* Current recipe hint */}
        {currentRecipe && (
          <div className="current-recipe-hint">
            💡 Click a cell to add <strong>🍽️ {currentRecipe.title}</strong> to your plan
          </div>
        )}
        
        {/* Calendar Grid */}
        <div className="meal-calendar">
          {/* Header row with days */}
          <div className="calendar-header">
            <div className="meal-type-header"></div>
            {weekDates.map(({ date, dayName, isToday }) => (
              <div 
                key={date} 
                className={`day-header ${isToday ? 'today' : ''}`}
              >
                <span className="day-name">{dayName}</span>
                <span className="day-date">{new Date(date).getDate()}</span>
              </div>
            ))}
          </div>
          
          {/* Meal type rows */}
          {MEAL_TYPES.map(mealType => (
            <div key={mealType} className="calendar-row">
              <div className="meal-type-label">
                <span className="meal-emoji">{getMealTypeEmoji(mealType)}</span>
                <span className="meal-name">{getMealTypeLabel(mealType)}</span>
              </div>
              
              {weekDates.map(({ date, isToday }) => {
                const dayMeals = getMealsFor(date, mealType);
                
                return (
                  <div 
                    key={`${date}-${mealType}`}
                    className={`calendar-cell ${isToday ? 'today' : ''} ${currentRecipe ? 'clickable' : ''}`}
                    onClick={() => handleCellClick(date, mealType)}
                  >
                    {dayMeals.length === 0 ? (
                      <span className="empty-cell">+</span>
                    ) : (
                      dayMeals.map(meal => (
                        <div 
                          key={meal.id} 
                          className={`meal-chip ${meal.completed ? 'completed' : ''}`}
                        >
                          <span 
                            className="meal-check"
                            onClick={(e) => handleToggleComplete(meal.id, e)}
                            role="checkbox"
                            aria-checked={meal.completed}
                          >
                            {meal.completed ? '✅' : '⬜'}
                          </span>
                          <span className="meal-name-chip">
                            {meal.recipeEmoji} {meal.recipeName.slice(0, 12)}
                            {meal.recipeName.length > 12 ? '...' : ''}
                          </span>
                          <button 
                            className="remove-meal-btn"
                            onClick={(e) => handleRemoveMeal(meal.id, e)}
                            aria-label="Remove meal"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="meal-plan-summary">
          <div className="summary-item">
            <span className="summary-number">{meals.length}</span>
            <span className="summary-label">Meals Planned</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{meals.filter(m => m.completed).length}</span>
            <span className="summary-label">Completed</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{meals.filter(m => !m.completed).length}</span>
            <span className="summary-label">Remaining</span>
          </div>
        </div>
        
        {/* Add Modal */}
        {showAddModal && currentRecipe && selectedDay && (
          <div className="add-meal-modal" onClick={() => setShowAddModal(false)}>
            <div className="add-meal-content" onClick={e => e.stopPropagation()}>
              <h3>Add to Plan</h3>
              <p>
                Add <strong>🍽️ {currentRecipe.title}</strong> to{' '}
                <strong>{new Date(selectedDay).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
              </p>
              
              <div className="meal-type-select">
                {MEAL_TYPES.map(type => (
                  <button
                    key={type}
                    className={`meal-type-btn ${selectedMealType === type ? 'active' : ''}`}
                    onClick={() => setSelectedMealType(type)}
                  >
                    {getMealTypeEmoji(type)} {getMealTypeLabel(type)}
                  </button>
                ))}
              </div>
              
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="confirm-btn" onClick={handleAddToPlan}>
                  ✓ Add to Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
