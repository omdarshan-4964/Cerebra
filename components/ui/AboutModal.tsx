import React from 'react';

type Props = { open: boolean; onClose: () => void };

export default function AboutModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl border">
        <h3 className="text-xl font-bold mb-2">About Cerebra</h3>
        <p className="text-sm text-gray-700 mb-4">Cerebra converts any topic into an interactive learning map using advanced AI. It helps learners visualize knowledge, track progress, and explore curated pathways.</p>

        <h4 className="font-semibold mt-4">Purpose & Features</h4>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Generate personalized learning maps from any topic.</li>
          <li>Interactive node-based visualization with progress tracking.</li>
          <li>Templates, sample maps, and export capabilities.</li>
        </ul>

        <h4 className="font-semibold mt-4">Technology Stack</h4>
        <p className="text-sm text-gray-700">React, ReactFlow, TypeScript, Tailwind CSS, Google Gemini (AI).</p>

        <h4 className="font-semibold mt-4">Team / Creator</h4>
        <p className="text-sm text-gray-700">Built by the Cerebra team — open to contributions. Creator: omdarshan-4964.</p>

        <h4 className="font-semibold mt-4">Contact</h4>
        <p className="text-sm text-gray-700">Email: hello@cerebra.example (demo)</p>

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
}
