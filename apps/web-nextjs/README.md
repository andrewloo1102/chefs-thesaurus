# Chef's Thesaurus - Next.js App

A cooking substitution finder built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔍 Search 20+ ingredient substitutions
- 📊 Precise measurement calculations
- 🎨 Beautiful UI with shadcn/ui components
- 🚀 Server-side API routes with real backend logic
- 📱 Responsive design

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## API Routes

- `POST /api/substitutions` - Search for ingredient substitutions
- `POST /api/effects` - Describe substitution effects
- `POST /api/stores` - Lookup nearby stores

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React

## Project Structure

```
app/
├── api/              # API routes
│   ├── substitutions/
│   ├── effects/
│   └── stores/
├── page.tsx          # Main page
└── globals.css       # Global styles

components/           # React components
lib/
├── core/            # Core business logic
├── data/            # Frontend data
├── serverdata/      # Backend data (substitutions.json)
└── api.ts           # API client
```

## Deployment

Deploy to Vercel with one click:

```bash
vercel --prod
```

Your app will be live with:
- Automatic HTTPS
- Global CDN
- Serverless functions for API routes
```bash
