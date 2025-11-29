# Digital Menu Management System

A full-stack Digital Menu Management System built with the T3 Stack (Next.js, TRPC, Prisma, Tailwind).

## Prerequisites

- Node.js (v18+)
- PostgreSQL Database (Neon.com recommended)

## Setup

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Open `.env` and update `DATABASE_URL` with your Neon connection string:
        ```env
        DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"
        ```

4.  **Push Database Schema**:
    - This creates the tables in your database.
    ```bash
    npm run db:push
    ```

## Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js App Router pages
- `src/server/api`: TRPC routers (Backend logic)
- `prisma/schema.prisma`: Database schema
- `src/components`: UI components (shadcn/ui)


## IDE used:
- Visual Studio Code
## Ai used:
- ChatGPT for some UI changes and css changes
