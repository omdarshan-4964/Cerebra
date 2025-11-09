import ROADMAP_TEMPLATES from './roadmap-templates';
import { LearningMapData } from './types';

// Normalize strings: lowercase, remove punctuation, collapse spaces
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\.\-_/+]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Robust detector: token overlap and substring checks
export function detectRoadmap(topic: string): LearningMapData | null {
  if (!topic) return null;
  const q = normalize(topic);

  // direct exact match first
  for (const t of ROADMAP_TEMPLATES) {
    if (normalize(t.topic) === q) return JSON.parse(JSON.stringify(t)) as LearningMapData;
  }

  // token overlap scoring
  const qTokens = new Set(q.split(' '));
  let best: { score: number; template?: LearningMapData } = { score: 0 };

  for (const t of ROADMAP_TEMPLATES) {
    const tNorm = normalize(t.topic);
    // substring checks
    if (tNorm.includes(q) || q.includes(tNorm)) {
      return JSON.parse(JSON.stringify(t)) as LearningMapData;
    }

    const tTokens = new Set(tNorm.split(' '));
    let overlap = 0;
    for (const token of qTokens) if (tTokens.has(token)) overlap++;

    if (overlap > best.score) {
      best.score = overlap;
      best.template = t as LearningMapData;
    }
  }

  // require at least one token overlap to accept
  if (best.score >= 1 && best.template) return JSON.parse(JSON.stringify(best.template));

  return null;
}

export default detectRoadmap;
