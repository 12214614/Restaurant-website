# Spicy Biryani Restaurant Website

A modern restaurant ordering system with real-time order tracking, admin dashboard, and chatbot support.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Supabase** account (for backend services)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the `project` directory with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these values in your Supabase project settings under API.

## Running the Application

### Development Server

To start the development server with hot-reload:

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will start at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

To create an optimized production build:

```bash
npm run build
```

or

```bash
yarn build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

or

```bash
yarn preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality
- `npm run typecheck` - Check TypeScript types

## Supabase Setup

### 1. Database Migration

Run the migration file to set up the database schema:

```bash
# Using Supabase CLI
supabase db push
```

Or manually run the SQL migration file:
- `supabase/migrations/20251004050546_create_orders_schema.sql`

### 2. Edge Functions Setup

Deploy the edge functions to Supabase:

```bash
# Deploy all functions
supabase functions deploy send-order-email
supabase functions deploy send-order-sms
supabase functions deploy send-status-update-email
supabase functions deploy send-status-update-sms
```

Or deploy individually:

```bash
cd supabase/functions/send-order-email
supabase functions deploy send-order-email
```

### 3. Environment Variables for Edge Functions

Set these secrets in Supabase Dashboard under Edge Functions:

- `RESEND_API_KEY` - For sending emails (get from https://resend.com)
- `TWILIO_ACCOUNT_SID` - For sending SMS (get from https://twilio.com)
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

Set secrets via Supabase CLI:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_auth_token
supabase secrets set TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Features

- 🍛 **Menu Display** - Browse delicious biryani options
- 🛒 **Shopping Cart** - Add items and manage cart
- 📦 **Order Tracking** - Real-time order status updates
- 👨‍💼 **Admin Dashboard** - Manage orders and update status
- 💬 **Chatbot** - Customer support chatbot
- 📧 **Email Notifications** - Order confirmations and status updates
- 📱 **SMS Notifications** - SMS updates for order status
- 🔄 **Real-time Updates** - Live order tracking via Supabase subscriptions

## Project Structure

```
project/
├── src/
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── lib/              # Utilities (Supabase client)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── supabase/
│   ├── functions/        # Edge functions
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Admin Access

To access the admin dashboard:
- Navigate to `/admin` or click the "Admin" button in the navigation
- Default credentials may need to be configured in `AdminLogin.tsx`

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port.

### Supabase Connection Issues

1. Verify your `.env` file has correct Supabase credentials
2. Check that your Supabase project is active
3. Ensure RLS (Row Level Security) policies are configured correctly

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

## Support

For issues or questions, contact: +91 9390492316


