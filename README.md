# ANYMESS

**ANYMESS** is an anonymous messaging app built with Next.js. It lets users send and receive messages without showing who sent them. After signing up and verifying their email, users get a unique link (like `anymess.com/u/username`) to share. Anyone with the link can send messages, and the user can see them on their dashboard.

## Features

- Send and receive messages anonymously
- Unique URL for each user to get messages
- Email verification for secure signup
- Login system with NextAuth
- Dashboard to view all messages
- Professional email address for notifications (e.g., `onboarding@anymess.com`)

## Tech Stack

- Next.js 14 (for frontend and backend)
- NextAuth for login
- Resend for sending emails
- Prisma with Turso (libSQL) for the database
- TypeScript for safer code
- Deployed on Vercel

## How to Set Up Locally

Follow these steps to run ANYMESS on your computer:

1. **Clone the Project**:
   ```
   git clone https://github.com/surajju/anymess.git
   cd anymess
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Set Up the Database**:
   - Create a Turso database:
     ```
     turso db create anymess
     ```
   - Get your database URL and auth token:
     ```
     turso db show anymess --url
     turso auth token
     ```
   - Run this command to set up the database tables:
     ```
     npx prisma migrate dev
     ```

4. **Add Environment Variables**:
   - Create a `.env` file in the project folder and add these:
     ```
     RESEND_API_KEY=re_123456789  # Get this from resend.com
     BASE_URL=http://localhost:3000
     DATABASE_URL=libsql://your-db-url  # Your Turso database URL
     DATABASE_AUTH_TOKEN=your-auth-token  # Your Turso auth token
     NEXTAUTH_SECRET=your-secret-here  # Generate with `openssl rand -base64 32`
     NEXTAUTH_URL=http://localhost:3000
     ```

5. **Run the App**:
   ```
   npm run dev
   ```
   - Open `http://localhost:3000` in your browser.
   - Sign up, verify your email, and test sending messages to your unique URL (e.g., `http://localhost:3000/u/username`).

## Notes

- You need Node.js (18.x or higher), npm, Git, and the Turso CLI to run this.
- Resend's free tier only sends emails to verified addresses unless you set up a custom domain.

**Built by Suraj**  
[GitHub](https://github.com/surajju)
