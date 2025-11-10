# Project Context for Claude AI

## Project Overview
I have a Next.js 14 application called Cerebra that generates AI-powered learning roadmaps. Here's the current implementation:

### Current Tech Stack
```json
{
  "frontend": {
    "framework": "Next.js 14",
    "ui": "React 18.3.1",
    "styling": "Tailwind CSS 3.4.7",
    "typescript": "5.5.4",
    "visualization": "React Flow 11.11.4",
    "icons": "Lucide React 0.427.0"
  },
  "ai": {
    "provider": "Google Generative AI (Gemini)",
    "version": "0.24.1"
  }
}
```

### Current Features
1. Generate learning roadmaps using Google's Gemini AI
2. Interactive node-based visualization using React Flow
3. Difficulty levels (beginner/intermediate/advanced)
4. Local storage for saving maps
5. Export maps as JSON
6. Curated templates for common topics
7. Toast notifications system
8. Responsive design with glassmorphic UI

### Core Components
1. `AILearningMap.tsx` - Main visualization component
2. `api/generate/route.ts` - AI integration endpoint
3. Custom hooks for storage and notifications
4. Roadmap templates and detection system

### Request for New Features

I'm looking to enhance Cerebra with the following capabilities:
1. [Your desired new features here]
2. [Ensure they integrate well with existing codebase]
3. [Consider performance and scalability]

### Important Implementation Details

#### Current AI Integration
```typescript
// Using Google's Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```

#### Node Visualization
```typescript
// Using React Flow with custom nodes
const CustomNode = React.memo(({ data, selected }: NodeProps) => {
  // Glassmorphic UI with gradients
  // Interactive hover states
  // Resource expansion
});
```

#### Data Structure
```typescript
interface LearningNode {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  resources?: Resource[];
  children?: string[];
  completed?: boolean;
}
```

### Project Structure
```
Cerebra/
├── app/                           # Next.js 14 App Router
├── components/                    # React components
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities and types
└── public/                       # Static assets
```

### Environment Variables
```env
GEMINI_API_KEY=your_api_key_here
```

## Instructions for Claude

1. Review the current implementation
2. Suggest new features that align with the existing architecture
3. Provide implementation details considering:
   - Type safety (TypeScript)
   - Performance optimization
   - Code organization
   - UI consistency
   - Error handling
   - State management

Please provide:
1. Detailed code examples
2. File structure changes
3. New component designs
4. API endpoint modifications
5. Required dependency additions

The code should maintain the current project's:
- Modern UI aesthetics
- Type safety
- Performance standards
- Code organization
- Error handling patterns



[Paste the content from CLAUDE_PROMPT.md]

Based on this current implementation, I'd like to add these new features:

1. User Authentication with GitHub/Google
2. Collaborative real-time editing of maps
3. AI-powered resource recommendations
4. Progress tracking system
5. Mobile-responsive touch interactions

Please provide detailed implementation steps and code examples for these features while maintaining the existing project's architecture and coding standards.