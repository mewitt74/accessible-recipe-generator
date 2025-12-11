import { useState } from 'react';
import InstructionPhotoImporter from './InstructionPhotoImporter';
import type { Recipe, Ingredient, Step } from '../types';

interface Props {
  initialRecipe?: Recipe;
  onSave: (r: Recipe) => void;
}

const emptyIngredient = (): Ingredient => ({ amount: '', name: '', note: '' });
const emptyStep = (): Step => ({ section: 'Prep', shortTitle: '', instruction: '' });

export default function RecipeForm({ initialRecipe, onSave }: Props) {
  const [title, setTitle] = useState(initialRecipe?.title ?? '');
  const [subtitle, setSubtitle] = useState(initialRecipe?.subtitle ?? '');
  const [servings, setServings] = useState<number>(initialRecipe?.servings ?? 1);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(initialRecipe?.prepTimeMinutes ?? 0);
  const [cookTimeMinutes, setCookTimeMinutes] = useState<number>(initialRecipe?.cookTimeMinutes ?? 0);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialRecipe?.ingredients ?? [emptyIngredient()]);
  const [equipment] = useState<string[]>(initialRecipe?.equipment ?? []);
  const [steps, setSteps] = useState<Step[]>(initialRecipe?.steps ?? [emptyStep()]);
  const [tips] = useState<string[]>(initialRecipe?.tips ?? []);

  const updateIngredient = (index: number, patch: Partial<Ingredient>) => {
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, ...patch } : ing));
  };

  const addIngredient = () => setIngredients(prev => [...prev, emptyIngredient()]);
  const removeIngredient = (i: number) => setIngredients(prev => prev.filter((_, idx) => idx !== i));

  const updateStep = (index: number, patch: Partial<Step>) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, ...patch } : s));
  };
  const addStep = () => setSteps(prev => [...prev, emptyStep()]);
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    const r: Recipe = {
      title: title.trim() || 'My Recipe',
      subtitle: subtitle || undefined,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
      ingredients: ingredients.filter(i => i.name.trim() !== ''),
      equipment: equipment.filter(e => e.trim() !== ''),
      steps: steps.filter(s => s.instruction.trim() !== ''),
      tips: tips.filter(t => t.trim() !== ''),
    };
    onSave(r);
  };

  const handlePhotoImport = (importedRecipe: Recipe) => {
    setTitle(importedRecipe.title);
    setSubtitle(importedRecipe.subtitle ?? '');
    setServings(importedRecipe.servings);
    setPrepTimeMinutes(importedRecipe.prepTimeMinutes);
    setCookTimeMinutes(importedRecipe.cookTimeMinutes);
    setIngredients(importedRecipe.ingredients);
    setSteps(importedRecipe.steps);
  };

  return (
    <div>
      {/* Photo Instructions Importer */}
      <div className="recipe-form-photo-import">
        <InstructionPhotoImporter onImport={handlePhotoImport} />
      </div>

      {/* Manual Form */}
      <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="recipe-form" aria-label="Recipe form">
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input id="title" value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="form-row">
        <label htmlFor="subtitle">Subtitle</label>
        <input id="subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
      </div>

      <div className="form-row small-grid">
        <label htmlFor="servings">Servings</label>
        <input id="servings" type="number" min={1} value={servings} onChange={e => setServings(Number(e.target.value))} />
        <label htmlFor="prep">Prep (min)</label>
        <input id="prep" type="number" min={0} value={prepTimeMinutes} onChange={e => setPrepTimeMinutes(Number(e.target.value))} />
        <label htmlFor="cook">Cook (min)</label>
        <input id="cook" type="number" min={0} value={cookTimeMinutes} onChange={e => setCookTimeMinutes(Number(e.target.value))} />
      </div>

      <fieldset>
        <legend>Ingredients</legend>
        {ingredients.map((ing, i) => (
          <div key={i} className="form-row">
            <input aria-label={`amount-${i}`} value={ing.amount} placeholder="Amount" onChange={e => updateIngredient(i, { amount: e.target.value })} />
            <input aria-label={`name-${i}`} value={ing.name} placeholder="Ingredient" onChange={e => updateIngredient(i, { name: e.target.value })} />
            <input aria-label={`note-${i}`} value={ing.note ?? ''} placeholder="Note (optional)" onChange={e => updateIngredient(i, { note: e.target.value })} />
            <button type="button" onClick={() => removeIngredient(i)} aria-label={`remove-ingredient-${i}`}>Remove</button>
          </div>
        ))}
        <div>
          <button type="button" onClick={addIngredient}>Add Ingredient</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Steps</legend>
        {steps.map((s, i) => (
          <div key={i} className="form-row">
            <input aria-label={`shortTitle-${i}`} value={s.shortTitle} placeholder="Short Title" onChange={e => updateStep(i, { shortTitle: e.target.value })} />
            <textarea aria-label={`instruction-${i}`} value={s.instruction} placeholder="Instruction (one sentence recommended)" onChange={e => updateStep(i, { instruction: e.target.value })} />
            <button type="button" onClick={() => removeStep(i)} aria-label={`remove-step-${i}`}>Remove</button>
          </div>
        ))}
        <div>
          <button type="button" onClick={addStep}>Add Step</button>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn-primary">Save Recipe</button>
      </div>
    </form>
    </div>
  );
}
