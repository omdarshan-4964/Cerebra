export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
  type: 'video' | 'article' | 'book' | 'other';
  title: string;
  url: string;
}

export interface LearningNode {
  id: string;
  title: string;
  description: string;
  level: Level;
  category: string;
  resources?: Resource[];
  children?: string[];
  completed?: boolean;
}

export interface EdgeDef {
  from: string;
  to: string;
}

export interface LearningMapData {
  topic: string;
  nodes: LearningNode[];
  edges: EdgeDef[];
  // optional metadata
  templateId?: string;
  templateName?: string;
}

export type MapHistoryItem = LearningMapData & { savedAt: string; id: string };
