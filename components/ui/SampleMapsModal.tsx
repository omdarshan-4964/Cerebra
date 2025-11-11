import React, { useState } from 'react';
import { LearningMapData } from '../../lib/types';

type Props = { open: boolean; onClose: () => void; onSelect: (template: LearningMapData) => void };

// Example topics shown in the modal — these are only seeds. Actual map data is fetched from the server / Gemini API.
const EXAMPLE_TOPICS = [
  { topic: 'Web Development' },
  { topic: 'Machine Learning' },
  { topic: 'React.js' },
  { topic: 'Python Programming' },
  { topic: 'Data Science' },
];

export default function SampleMapsModal({ open, onClose, onSelect }: Props) {
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const loadTopic = async (topic: string) => {
    setError(null);
    setLoadingTopic(topic);
    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty: 'beginner' }),
      });
      if (!resp.ok) throw new Error(`Server error ${resp.status}`);
      const data = await resp.json();
      // pass generated map back to parent
      onSelect(data as LearningMapData);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate sample map');
    } finally {
      setLoadingTopic(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl p-6 shadow-xl border">
        <h3 className="text-xl font-bold mb-2">Try Sample Map</h3>
        <p className="text-sm text-gray-700 mb-4">Generate a live example learning map from the AI (no local templates are used).</p>

        <div className="grid md:grid-cols-3 gap-4">
          {EXAMPLE_TOPICS.map((t, idx) => (
            <div key={t.topic + idx} className="p-4 border rounded-lg flex flex-col justify-between">
              <div>
                <h4 className="font-semibold mb-1">{t.topic}</h4>
                <p className="text-sm text-gray-600 mb-2">Generate a curated learning map for this topic.</p>
                <p className="text-xs text-gray-500">Live from AI • Difficulty: Beginner</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => loadTopic(t.topic)} disabled={Boolean(loadingTopic)} className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                  {loadingTopic === t.topic ? 'Generating…' : 'Load'}
                </button>
                <button onClick={() => loadTopic(t.topic)} className="px-3 py-2 border rounded-lg text-sm">Preview</button>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
}
