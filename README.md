# Bland Flow

Interactive visualizer for Bland.ai voice agent pathways.

**Live Demo**: [bland-flow.vercel.app](https://bland-flow.vercel.app)

## Features

- **Upload or Paste** - Drop your Bland.ai pathway JSON or paste it directly
- **Interactive Flowchart** - Zoom, pan, and explore your conversation flows
- **Node Details** - Click any node to see prompts, conditions, and variable extraction
- **Stats Dashboard** - See pathway complexity at a glance
- **Color-coded Types** - Instantly identify Start, End Call, Webhook, and Route nodes

## Node Types

| Type | Color | Description |
|------|-------|-------------|
| Start | Green | Entry point of the conversation |
| Default | Blue | Standard conversation nodes |
| End Call | Red | Call termination points |
| Webhook | Purple | External API integrations |
| Route | Amber | Conditional routing nodes |
| Custom Tool | Cyan | Custom tool integrations |

## Tech Stack

- React + Vite
- React Flow (@xyflow/react)
- Tailwind CSS

## Usage

1. Export your pathway from Bland.ai (JSON format)
2. Upload the file or paste the JSON
3. Explore your conversation flow visually
4. Click nodes to see details

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Portfolio

Built by [Cameron O'Brien](https://github.com/cameronobriendev) as part of a Voice AI development portfolio.

---

*This tool helps Voice AI developers visualize and debug complex conversation pathways.*
