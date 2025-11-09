import { LearningMapData } from './types';
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
  {
    topic: 'Python Programming',
    templateId: 'template-python-v1',
    templateName: 'Python Programming (Core)',
    nodes: [
      { id: '1', title: 'Python Basics', description: 'Syntax, variables, and control flow', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'Python Official', url: 'https://docs.python.org/3/tutorial/' }], children: ['2'] },
      { id: '2', title: 'Data Structures', description: 'Lists, dicts, sets, tuples', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'Python Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html' }], children: ['3'] },
      { id: '3', title: 'Modules & Packaging', description: 'Importing, pip, virtualenv', level: 'intermediate', category: 'tools', resources: [{ type: 'article', title: 'Python Packaging', url: 'https://packaging.python.org/' }], children: ['4'] },
      { id: '4', title: 'Web & APIs', description: 'Flask/FastAPI basics', level: 'intermediate', category: 'backend', resources: [{ type: 'article', title: 'FastAPI', url: 'https://fastapi.tiangolo.com' }], children: ['5'] },
      { id: '5', title: 'Testing & CI', description: 'pytest and automation', level: 'intermediate', category: 'tools', resources: [{ type: 'article', title: 'pytest', url: 'https://docs.pytest.org/' }], children: [] },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' },
    ],
  },
  {
    topic: 'React.js',
    templateId: 'template-react-v1',
    templateName: 'React.js (Beginner→Advanced)',
    nodes: [
      { id: '1', title: 'JS & DOM', description: 'Modern JS and DOM manipulation', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'MDN JS', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' }], children: ['2'] },
      { id: '2', title: 'React Basics', description: 'Components, JSX, props, state', level: 'beginner', category: 'frontend', resources: [{ type: 'article', title: 'React Docs', url: 'https://reactjs.org/docs/getting-started.html' }], children: ['3'] },
      { id: '3', title: 'State Management', description: 'Context, Redux, or Zustand', level: 'intermediate', category: 'frontend', resources: [{ type: 'article', title: 'React State', url: 'https://reactjs.org/docs/state-and-lifecycle.html' }], children: ['4'] },
      { id: '4', title: 'Performance & Testing', description: 'Optimizations and testing setups', level: 'intermediate', category: 'tools', resources: [{ type: 'article', title: 'React Performance', url: 'https://reactjs.org/docs/optimizing-performance.html' }], children: [] },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },
  {
    topic: 'Data Science',
    templateId: 'template-ds-v1',
    templateName: 'Data Science (Practical)',
    nodes: [
      { id: '1', title: 'Statistics & Math', description: 'Probability and statistics basics', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' }], children: ['2'] },
      { id: '2', title: 'Python for Data', description: 'pandas and NumPy', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'Pandas', url: 'https://pandas.pydata.org' }], children: ['3'] },
      { id: '3', title: 'Exploratory Analysis', description: 'EDA and visualization', level: 'intermediate', category: 'tools', resources: [{ type: 'article', title: 'Seaborn', url: 'https://seaborn.pydata.org' }], children: ['4'] },
      { id: '4', title: 'Modeling', description: 'ML models and evaluation', level: 'intermediate', category: 'backend', resources: [{ type: 'article', title: 'Scikit-learn', url: 'https://scikit-learn.org' }], children: [] },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },
  {
    topic: 'Cloud Computing',
    templateId: 'template-cloud-v1',
    templateName: 'Cloud Computing (Foundations)',
    nodes: [
      { id: '1', title: 'Cloud Basics', description: 'IaaS, PaaS, SaaS concepts', level: 'beginner', category: 'fundamentals', resources: [{ type: 'article', title: 'AWS Cloud Concepts', url: 'https://aws.amazon.com/what-is-cloud-computing/' }], children: ['2'] },
      { id: '2', title: 'Compute & Networking', description: 'VMs, containers, and networking', level: 'beginner', category: 'backend', resources: [{ type: 'article', title: 'Docker', url: 'https://docs.docker.com/get-started/' }], children: ['3'] },
      { id: '3', title: 'Storage & Databases', description: 'Cloud storage and managed DBs', level: 'intermediate', category: 'database', resources: [{ type: 'article', title: 'Cloud Storage', url: 'https://cloud.google.com/storage' }], children: ['4'] },
      { id: '4', title: 'CI/CD & Infra as Code', description: 'Automation and IaC', level: 'intermediate', category: 'tools', resources: [{ type: 'article', title: 'Terraform', url: 'https://www.terraform.io' }], children: [] },
    ],
    edges: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
    ],
  },
];

export default ROADMAP_TEMPLATES;
