# Installation Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API Key

## Installation Steps

1. Clone the repository
```bash
git clone https://github.com/omdarshan-4964/Cerebra.git
cd Cerebra
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY
```

4. Run development server
```bash
npm run dev
```

5. Open http://localhost:3000

## Troubleshooting

- If Gemini API fails: Check API key in .env.local
- If nodes don't render: Clear cache and restart
- If build fails: Delete .next folder and rebuild