import { LearningMapData } from './types';

// A few curated templates to return immediately for common topics
export const ROADMAP_TEMPLATES: LearningMapData[] = [
  {
    topic: 'Web Development',
    templateId: 'template-web-dev-v1',
    templateName: 'Web Development (Core)',
    nodes: [
      { id: '1', title: 'HTML & CSS', description: 'Basics of structure and styling', level: 'beginner', category: 'frontend', resources: [{ type: 'article', title: 'MDN HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' }], children: ['2'] },
      { id: '2', title: 'JavaScript Fundamentals', description: 'Language basics and DOM', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'MDN JS Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' }], children: ['3'] },
      { id: '3', title: 'Frontend Framework', description: 'React or similar SPA framework', level: 'intermediate', category: 'frontend', resources: [{ type: 'video', title: 'React Official', url: 'https://reactjs.org' }], children: ['4'] },
      { id: '4', title: 'Backend Basics', description: 'APIs, Node.js, and servers', level: 'intermediate', category: 'backend', resources: [{ type: 'article', title: 'Node.js Guide', url: 'https://nodejs.org/en/docs' }], children: ['5'] },
      { id: '5', title: 'Databases', description: 'Relational and NoSQL basics', level: 'intermediate', category: 'database', resources: [{ type: 'article', title: 'Intro to Databases', url: 'https://www.postgresql.org/docs/' }], children: [] },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
    ],
  },
  {
    topic: 'Machine Learning',
    templateId: 'template-ml-v1',
    templateName: 'Machine Learning (Intro)',
    nodes: [
      { id: '1', title: 'Linear Algebra & Stats', description: 'Math foundations', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'Khan Academy Linear Algebra', url: 'https://www.khanacademy.org/math/linear-algebra' }], children: ['2'] },
      { id: '2', title: 'Python & Libraries', description: 'NumPy, pandas basics', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'Pandas', url: 'https://pandas.pydata.org' }], children: ['3'] },
      { id: '3', title: 'Supervised Learning', description: 'Regression and classification', level: 'intermediate', category: 'backend', resources: [{ type: 'article', title: 'Scikit-learn', url: 'https://scikit-learn.org' }], children: ['4'] },
      { id: '4', title: 'Deep Learning', description: 'Neural networks basics', level: 'advanced', category: 'backend', resources: [{ type: 'video', title: 'Deep Learning Intro', url: 'https://www.youtube.com' }], children: [] },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },
];

export default ROADMAP_TEMPLATES;
