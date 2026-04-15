# HSSAN Flower Classification — Setup Guide

This project uses **HSSAN (Hybrid Spectral-Spatial Attention Network)** for flower image classification with computer vision.

## Requirements

Install the following before running the project:

- Node.js 20+
- npm (comes with Node.js)
- Git (optional)

## Step 1 — Get the Project

```bash
# Option 1: Clone with Git
git clone <your-repo-url>
cd <project-folder>

# Option 2: Download ZIP and extract it, then open the folder
```

## Step 2 — Install Dependencies

```bash
npm install
```

## Step 3 — Run in Development

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

## Step 4 — Build for Production

```bash
npm run build
```

## Step 5 — Start Production Build

```bash
npm run start
```

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run start` — run production build
- `npm run check` — run TypeScript type check

## Project Summary

- **Project Description:** Use CNNs to classify flowers from color and shape cues in images.
- **Model Name:** HSSAN (Hybrid Spectral-Spatial Attention Network)
- **Task:** Multi-class flower image classification with a spectral-spatial attention-based CNN approach.
