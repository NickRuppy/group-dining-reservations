# Reservations App

A Next.js application for managing restaurant reservations with friends.

## Features

- User authentication (email/password and Google)
- Create and manage restaurant reservations
- Invite friends to join reservations
- Track reservation status and participants
- Real-time updates using Firebase

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in your Firebase configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Visit [Vercel](https://vercel.com) and sign up or log in

3. Click "New Project" and import your repository

4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: .next

5. Add environment variables:
   - Copy all variables from your `.env.local` file to Vercel's Environment Variables section

6. Deploy!

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Get these values from your Firebase project settings.