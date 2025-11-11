import React from 'react';
import { Brain, Globe, TrendingUp } from 'lucide-react';

type Props = { open: boolean; onClose: () => void };

const demoFeatures = [
  { Icon: Brain, title: 'AI Intelligence', desc: 'Uses Google Gemini to analyze topics and propose ordered learning paths.' },
  { Icon: Globe, title: 'Interactive Maps', desc: 'Visualize learning as a network-style knowledge graph with rich node cards.' },
  { Icon: TrendingUp, title: 'Personalized Progress', desc: 'Track completed nodes and export your learning plan.' },
];

export default function FeaturesModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl p-6 shadow-xl border">
        <h3 className="text-xl font-bold mb-2">Features</h3>
        <p className="text-sm text-gray-700 mb-4">Explore main features with examples and short demos.</p>

        <div className="grid md:grid-cols-3 gap-4">
          {demoFeatures.map((f, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center mb-3">
                <f.Icon className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="font-semibold">{f.title}</h4>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
}
