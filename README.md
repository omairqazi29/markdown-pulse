# Markdown Pulse

A minimal markdown-based blogging platform with live preview, tag filtering, and search. Write posts in markdown, organize with tags, and publish instantly.

🚀 **Live Demo:** https://omairqazi29.github.io/markdown-pulse/

## Features

- ✍️ **Markdown Editor** - Write posts in markdown with live preview
- 🏷️ **Tag System** - Organize posts with custom tags
- 🔍 **Search** - Search through all your posts
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 💾 **Local Storage** - All data persists in your browser
- 📱 **Responsive Design** - Works on all devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Deployment

### GitHub Pages

1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages

### Render

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## Usage

1. Click "New Post" to create a blog post
2. Write your content in markdown on the left
3. See live preview on the right
4. Add tags separated by commas
5. Click "Save Post" to publish

## Tech Stack

- Vite
- Marked.js (Markdown parser)
- DOMPurify (XSS sanitization)
- Vanilla JavaScript

## License

MIT
