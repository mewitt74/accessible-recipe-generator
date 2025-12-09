import React, { useState } from 'react';
import type { Recipe } from '../types';

interface Props {
  onImport: (r: Recipe) => void;
}

export default function RecipeImporter({ onImport }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setError(null);
    try {
      setLoading(true);
      const resp = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error || `Import failed (${resp.status})`);
      }
      const data = await resp.json();
      if (!data?.recipe) throw new Error('No recipe returned');
      onImport(data.recipe as Recipe);
    } catch (err) {
      setError((err as Error).message || 'Failed to import recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="importer">
      <label htmlFor="recipe-url">Recipe URL</label>
      <input id="recipe-url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.allrecipes.com/recipe/..." />
      <div className="form-actions">
        <button onClick={handleImport} disabled={loading} className="btn-primary">{loading ? 'Importing...' : 'Import'}</button>
      </div>
      {error && <div role="alert" className="error">{error}</div>}
      <p className="hint">Tip: paste a recipe URL. This will call the local `/api/import` endpoint.</p>
    </div>
  );
}
