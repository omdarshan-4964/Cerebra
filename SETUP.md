# Quick Setup Guide

## Environment Variables

Create a `.env` file in the root directory with:

```
ANTHROPIC_API_KEY=your_api_key_here
```

**Note:** The app works without an API key using mock data. To use AI-generated maps, get your API key from [Anthropic Console](https://console.anthropic.com/).

## Installation Steps

1. Install dependencies:
```bash
npm install
```

2. (Optional) Add your API key to `.env`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Try It Out

- Enter any topic (e.g., "Web Development", "Machine Learning")
- Click "Generate Learning Map" or use the sample data button
- Interact with the nodes, filter by difficulty, and export to JSON!

