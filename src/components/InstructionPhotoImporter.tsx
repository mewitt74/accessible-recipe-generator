import { useState, useRef } from 'react';
import { Recipe, Ingredient } from '../types';
import { extractInstructionsFromImage, type OcrProgressUpdate } from '../services/imageRecognition';

interface Props {
  onImport: (recipe: Recipe) => void;
  onCancel?: () => void;
}

export default function InstructionPhotoImporter({ onImport, onCancel }: Props) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedInstructions, setExtractedInstructions] = useState<string[]>([]);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<OcrProgressUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Recipe form fields
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState('4');
  const [prepTime, setPrepTime] = useState('0');
  const [cookTime, setCookTime] = useState('0');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (jpg, png, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please use an image under 10MB.');
      return;
    }

    setImageProcessing(true);
    setError(null);
    setExtractedInstructions([]);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Extract instructions from image
      console.log('Extracting instructions from photo...');
      const result = await extractInstructionsFromImage(file, (update) =>
        setOcrProgress(update)
      );

      if (result.success && result.instructions.length > 0) {
        setExtractedInstructions(result.instructions);
        setError(null);
      } else {
        setError(
          result.error ||
            'Could not extract instructions. Try a clearer photo of cooking instructions.'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to process image'
      );
    } finally {
      setImageProcessing(false);
      setTimeout(() => setOcrProgress(null), 300);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    field: 'name' | 'amount',
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleRemoveInstruction = (index: number) => {
    setExtractedInstructions(extractedInstructions.filter((_, i) => i !== index));
  };

  const handleEditInstruction = (index: number, value: string) => {
    const newInstructions = [...extractedInstructions];
    newInstructions[index] = value;
    setExtractedInstructions(newInstructions);
  };

  const handleSaveRecipe = () => {
    // Validation
    if (!recipeName.trim()) {
      setError('Please enter a recipe name');
      return;
    }

    if (extractedInstructions.length === 0) {
      setError('Please add at least one instruction');
      return;
    }

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(i => i.name.trim());

    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    // Create recipe object
    const recipe: Recipe = {
      id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: recipeName.trim(),
      ingredients: validIngredients,
      equipment: [],
      steps: extractedInstructions.map((instruction, index) => ({
        stepNumber: index + 1,
        instruction,
      })),
      prepTimeMinutes: parseInt(prepTime) || 0,
      cookTimeMinutes: parseInt(cookTime) || 0,
      servings: parseInt(servings) || 4,
      difficulty: 'medium',
    };

    onImport(recipe);
  };

  return (
    <div className="instruction-importer-container">
      <h2>📸 Import Recipe from Instructions</h2>
      <p className="instruction-importer-subtitle">
        Take a photo of cooking instructions (box, label, recipe card) and we'll fill in the steps
      </p>

      {/* Photo Upload Section */}
      <div className="importer-upload-section">
        {!uploadedImage && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={imageProcessing}
            className="btn-upload-large"
          >
            📷 Take Photo of Instructions
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {imageProcessing && (
          <div className="progress-indicator">
            <div className="spinner"></div>
            <p>{ocrProgress?.status || 'Processing image...'}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(ocrProgress?.progress || 0) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {uploadedImage && (
          <div className="uploaded-image-preview">
            <img src={uploadedImage} alt="Uploaded instruction" />
            <button
              onClick={() => {
                setUploadedImage(null);
                setExtractedInstructions([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="btn-secondary"
            >
              Change Photo
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      {/* Recipe Details Form */}
      {extractedInstructions.length > 0 && (
        <div className="recipe-form-section">
          <h3>Recipe Details</h3>

          {/* Recipe Name */}
          <div className="form-group">
            <label htmlFor="recipe-name">Recipe Name *</label>
            <input
              id="recipe-name"
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              placeholder="Enter recipe name (e.g., Mac and Cheese)"
              className="form-input"
            />
          </div>

          {/* Time and Servings */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prep-time">Prep Time (minutes)</label>
              <input
                id="prep-time"
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cook-time">Cook Time (minutes)</label>
              <input
                id="cook-time"
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input
                id="servings"
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label>Ingredients *</label>
            <div className="ingredients-list">
              {ingredients.map((ing, index) => (
                <div key={index} className="ingredient-input-row">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) =>
                      handleIngredientChange(index, 'name', e.target.value)
                    }
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Amount (e.g., 2 cups)"
                    value={ing.amount}
                    onChange={(e) =>
                      handleIngredientChange(index, 'amount', e.target.value)
                    }
                    className="form-input"
                  />
                  {ingredients.length > 1 && (
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="btn-remove"
                      title="Remove ingredient"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleAddIngredient}
              className="btn-secondary"
              style={{ marginTop: '10px' }}
            >
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="form-group">
            <label>Cooking Instructions *</label>
            <p className="form-hint">Edit the extracted instructions below</p>
            <div className="instructions-list">
              {extractedInstructions.map((instruction, index) => (
                <div key={index} className="instruction-edit-row">
                  <span className="step-number">{index + 1}</span>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleEditInstruction(index, e.target.value)}
                    className="form-textarea"
                    rows={2}
                  />
                  {extractedInstructions.length > 1 && (
                    <button
                      onClick={() => handleRemoveInstruction(index)}
                      className="btn-remove"
                      title="Remove step"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              onClick={handleSaveRecipe}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '18px' }}
            >
              ✓ Save Recipe
            </button>
            {onCancel && (
              <button onClick={onCancel} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
