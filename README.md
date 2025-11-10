# 🧠 Cerebra — AI-Powered Learning Map Generator

> *Personalized AI-driven learning maps for developers and learners, built with Next.js 14, TypeScript, and Google's Generative AI.*

Cerebra helps learners generate **structured, interactive learning roadmaps** for any topic — complete with difficulty levels, recommended resources, and a beautiful, dynamic UI. Perfect for self-learners, educators, and teams looking to create clear learning paths.

---

## 🚀 Features

- 🧩 **AI-Powered Learning Paths** — Generates topic-based roadmaps using Google's Gemini AI  
- 🎨 **Modern UI/UX** — Smooth animations, glassmorphic design, and gradient aesthetics with Tailwind CSS  
- 🗺️ **Interactive Maps** — Explore node-based roadmaps with React Flow  
- 🎚️ **Difficulty Filters** — Categorized nodes for beginner, intermediate, and advanced levels  
- 🧭 **Auto Layout** — Intelligent node positioning for better visualization  
- 💾 **Export Functionality** — Save your generated maps as JSON files  
- 🔄 **Custom Hooks** — Reusable `useToast` and `useLocalStorage` hooks for efficient state handling  
- ⚡ **Fast and Scalable** — Built with Next.js 14 and TypeScript for performance and maintainability  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **AI Integration** | Google Generative AI (Gemini) |
| **Visualization** | React Flow 11 |
| **UI Components** | Lucide React Icons |
| **State Management** | Custom React Hooks |
| **Build Tools** | Node.js 18+, npm |
| **Deployment** | Vercel |

---

## 🧩 System Overview

```
User Input → API Route (Google Gemini) → Generate Learning Topics → Create Nodes & Edges → Render Map (React Flow)
```

Each node represents a concept with a difficulty level and related resources. The roadmap features:
- Intelligent auto-layout for optimal visualization
- Difficulty-based color coding
- Resource links for each topic
- Interactive node exploration
- Export capabilities for sharing

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+ (recommended: v18.17 or higher)
- npm v9+ (or yarn/pnpm)
- Google Cloud Account with Generative AI API access (optional)

---

### Installation

```bash
# Clone the repository
git clone https://github.com/omdarshan-4964/Cerebra.git
cd Cerebra

# Install dependencies
npm install

# Verify installation
npm run build
```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Required for AI-powered map generation
GEMINI_API_KEY=your_api_key_here

# Optional - customize node counts (default: 5-10)
MAX_NODES=15
MIN_NODES=5

# Optional - Override API endpoint
GEMINI_API_ENDPOINT=https://your-custom-endpoint
```

> 🧠 No API key? The app includes curated templates for Web Development, Machine Learning, Python, and more!

### Key Dependencies

```json
{
  "@google/generative-ai": "^0.24.1",
  "next": "14.2.5",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "reactflow": "^11.11.4",
  "lucide-react": "^0.427.0"
}
```

---

### Development

Run the local development server:

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Build for Production

```bash
npm run build
npm start
```

---

## 🧭 Usage

1. **Enter a Topic** — e.g., "Full Stack Web Development"
2. **Select Difficulty** — Choose beginner, intermediate, or advanced
3. **Click "Generate Map"** — Let the AI create a personalized roadmap
4. **Explore & Interact** — Hover to see learning resources and relationships
5. **Export JSON** — Download your learning roadmap

---

## 📁 Project Structure

```
Cerebra/
├── app/                            # Next.js 14 App Router
│   ├── api/
│   │   └── generate/
│   │       └── route.ts           # Gemini AI integration
│   ├── layout.tsx                 # Root layout with metadata
│   ├── globals.css               # Global styles & Tailwind
│   └── page.tsx                  # Home page component
├── components/
│   ├── AILearningMap.tsx         # Main map visualization
│   └── ui/
│       └── Toast.tsx             # Notification system
├── hooks/                         # Custom React Hooks
│   ├── useLocalStorage.ts        # Local storage manager
│   └── useToast.ts              # Toast notifications
├── lib/                          # Core utilities
│   ├── roadmap-detector.ts      # Topic detection logic
│   ├── roadmap-templates.ts     # Curated learning paths
│   └── types.ts                 # TypeScript definitions
├── docs/                         # Documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── README.md                # Development docs
│   └── SUBMISSION.md            # Project details
├── public/                       # Static assets
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

---

## 🎨 UI Highlights

* ✨ Clean, modern gradients
* 🎭 Smooth animations on hover
* 🧠 Minimal and distraction-free layout
* 🗺️ Fully interactive learning map
* 🌈 Glassmorphic design elements
* 🎯 Clear visual hierarchy
* 🎨 Consistent color scheme
* 📱 Responsive design

---

## 🔮 Future Improvements

* 📚 Enhanced resource recommendations using AI
* 🧩 Drag-and-drop roadmap customization
* ☁️ User authentication and progress tracking
* 🔗 Collaborative map sharing and voting
* 🌐 Community-contributed templates
* 📱 Mobile app with offline support
* 🎯 Progress tracking and gamification
* 🔄 Integration with learning platforms

---

## 💡 Development Process

Building Cerebra improved understanding of:

* Modern Next.js 14 App Router and React Server Components
* TypeScript type safety and dynamic data structures
* Google's Generative AI API and prompt engineering
* Complex visualizations with React Flow
* State management with custom hooks
* Performance optimization techniques
* Modern UI/UX design principles

---

## 🌐 Live Demo & Code

* 🔴 **Live App:** [https://cerebra-ten.vercel.app](https://cerebra-ten.vercel.app)
* 💻 **GitHub Repo:** [https://github.com/omdarshan-4964/Cerebra](https://github.com/omdarshan-4964/Cerebra)

---

## 🧑‍💻 Author

**Omdarshan Shindepatil**  
🚀 Full Stack Developer | Cybersecurity Enthusiast | AI Explorer

🔗 [LinkedIn](https://www.linkedin.com/in/omdarshan-shindepatil) • [Portfolio](#) • [Twitter](#)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use and modify it.

---

⭐ *If you like this project, consider giving it a star on GitHub!*  
Made with ❤️ using **Next.js 14**, **TypeScript**, and **Google's Generative AI**.