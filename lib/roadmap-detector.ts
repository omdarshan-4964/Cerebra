import ROADMAP_TEMPLATES from './roadmap-templates';
import { LearningMapData } from './types';

// Very small heuristic: check if topic matches a template topic (case-insensitive substring)
export function detectRoadmap(topic: string): LearningMapData | null {
  if (!topic) return null;
  const q = topic.toLowerCase().trim();
  for (const t of ROADMAP_TEMPLATES) {
    if (t.topic.toLowerCase() === q || t.topic.toLowerCase().includes(q) || q.includes(t.topic.toLowerCase())) {
      // return a shallow clone
      return JSON.parse(JSON.stringify(t)) as LearningMapData;
    }
  }
  return null;
}

export default detectRoadmap;
