/**
 * Feedback Modal Component
 * Allow users to rate recipes and submit feedback
 */

import { useState } from 'react';
import {
  type RecipeRating,
  type FeedbackReport,
  saveRecipeRating,
  submitFeedback,
  FEEDBACK_TYPES,
  getStarDisplay,
} from '../services/feedbackService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId?: string;
  recipeName?: string;
  mode: 'rating' | 'feedback';
}

export default function FeedbackModal({
  isOpen,
  onClose,
  recipeId,
  recipeName,
  mode,
}: FeedbackModalProps) {
  // Rating state
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<RecipeRating['difficulty']>('just-right');
  const [wouldMakeAgain, setWouldMakeAgain] = useState<boolean>(true);
  const [ratingComment, setRatingComment] = useState('');
  
  // Feedback state
  const [feedbackType, setFeedbackType] = useState<FeedbackReport['type']>('suggestion');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackSeverity, setFeedbackSeverity] = useState<FeedbackReport['severity']>('medium');
  
  // Submission state
  const [submitted, setSubmitted] = useState(false);
  
  if (!isOpen) return null;
  
  const handleRatingSubmit = () => {
    if (rating === 0 || !recipeId || !recipeName) return;
    
    saveRecipeRating({
      recipeId,
      recipeName,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      difficulty,
      wouldMakeAgain,
      comment: ratingComment || undefined,
    });
    
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      resetForm();
    }, 2000);
  };
  
  const handleFeedbackSubmit = () => {
    if (!feedbackDescription.trim()) return;
    
    submitFeedback({
      type: feedbackType,
      description: feedbackDescription,
      recipeId,
      recipeName,
      severity: feedbackSeverity,
    });
    
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      resetForm();
    }, 2000);
  };
  
  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setDifficulty('just-right');
    setWouldMakeAgain(true);
    setRatingComment('');
    setFeedbackType('suggestion');
    setFeedbackDescription('');
    setFeedbackSeverity('medium');
    setSubmitted(false);
  };
  
  // Star rating component
  const StarRating = () => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          aria-label={`Rate ${star} stars`}
        >
          {star <= (hoverRating || rating) ? '⭐' : '☆'}
        </button>
      ))}
      <span className="rating-text">
        {rating > 0 ? getStarDisplay(rating) : 'Tap to rate'}
      </span>
    </div>
  );
  
  return (
    <div className="feedback-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className="feedback-success">
            <div className="success-icon">✅</div>
            <h3>Thank You!</h3>
            <p>{mode === 'rating' ? 'Your rating has been saved.' : 'Your feedback has been submitted.'}</p>
          </div>
        ) : mode === 'rating' ? (
          <>
            <div className="feedback-header">
              <h2>⭐ Rate This Recipe</h2>
              <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>
            
            {recipeName && (
              <p className="recipe-being-rated">Rating: <strong>{recipeName}</strong></p>
            )}
            
            <div className="feedback-form">
              {/* Star Rating */}
              <div className="form-group">
                <label>How would you rate this recipe?</label>
                <StarRating />
              </div>
              
              {/* Difficulty */}
              <div className="form-group">
                <label>How was the difficulty?</label>
                <div className="difficulty-options">
                  <button
                    className={`difficulty-btn ${difficulty === 'too-easy' ? 'active' : ''}`}
                    onClick={() => setDifficulty('too-easy')}
                  >
                    😴 Too Easy
                  </button>
                  <button
                    className={`difficulty-btn ${difficulty === 'just-right' ? 'active' : ''}`}
                    onClick={() => setDifficulty('just-right')}
                  >
                    👍 Just Right
                  </button>
                  <button
                    className={`difficulty-btn ${difficulty === 'too-hard' ? 'active' : ''}`}
                    onClick={() => setDifficulty('too-hard')}
                  >
                    😰 Too Hard
                  </button>
                </div>
              </div>
              
              {/* Would Make Again */}
              <div className="form-group">
                <label>Would you make this again?</label>
                <div className="yes-no-options">
                  <button
                    className={`yes-no-btn ${wouldMakeAgain ? 'active yes' : ''}`}
                    onClick={() => setWouldMakeAgain(true)}
                  >
                    👍 Yes!
                  </button>
                  <button
                    className={`yes-no-btn ${!wouldMakeAgain ? 'active no' : ''}`}
                    onClick={() => setWouldMakeAgain(false)}
                  >
                    👎 No
                  </button>
                </div>
              </div>
              
              {/* Optional Comment */}
              <div className="form-group">
                <label>Any comments? (optional)</label>
                <textarea
                  value={ratingComment}
                  onChange={e => setRatingComment(e.target.value)}
                  placeholder="Tips, modifications, or thoughts..."
                  rows={3}
                />
              </div>
              
              <button 
                className="submit-btn" 
                onClick={handleRatingSubmit}
                disabled={rating === 0}
              >
                ✓ Submit Rating
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="feedback-header">
              <h2>💬 Send Feedback</h2>
              <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
            </div>
            
            <div className="feedback-form">
              {/* Feedback Type */}
              <div className="form-group">
                <label>What kind of feedback?</label>
                <div className="feedback-type-grid">
                  {FEEDBACK_TYPES.map(type => (
                    <button
                      key={type.type}
                      className={`feedback-type-btn ${feedbackType === type.type ? 'active' : ''}`}
                      onClick={() => setFeedbackType(type.type)}
                    >
                      <span className="type-emoji">{type.emoji}</span>
                      <span className="type-label">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Description */}
              <div className="form-group">
                <label>Tell us more</label>
                <textarea
                  value={feedbackDescription}
                  onChange={e => setFeedbackDescription(e.target.value)}
                  placeholder="Please describe your feedback in detail..."
                  rows={4}
                  required
                />
              </div>
              
              {/* Severity (for bugs) */}
              {feedbackType === 'bug' && (
                <div className="form-group">
                  <label>How serious is this?</label>
                  <div className="severity-options">
                    <button
                      className={`severity-btn ${feedbackSeverity === 'low' ? 'active' : ''}`}
                      onClick={() => setFeedbackSeverity('low')}
                    >
                      🟢 Minor
                    </button>
                    <button
                      className={`severity-btn ${feedbackSeverity === 'medium' ? 'active' : ''}`}
                      onClick={() => setFeedbackSeverity('medium')}
                    >
                      🟡 Medium
                    </button>
                    <button
                      className={`severity-btn ${feedbackSeverity === 'high' ? 'active' : ''}`}
                      onClick={() => setFeedbackSeverity('high')}
                    >
                      🔴 Critical
                    </button>
                  </div>
                </div>
              )}
              
              <button 
                className="submit-btn" 
                onClick={handleFeedbackSubmit}
                disabled={!feedbackDescription.trim()}
              >
                📤 Submit Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
