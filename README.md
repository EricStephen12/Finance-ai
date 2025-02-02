# Financial AI - Personal Finance Management Application

## Features

- 📊 Comprehensive financial tracking and management
- 📈 Advanced analytics and reporting
- 🤖 AI-powered financial insights and recommendations
- 🔒 Secure authentication with Firebase
- 📱 Responsive design for all devices
- 🌙 Dark mode support

## Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Hosting**: Vercel
- **Analytics**: Firebase Analytics

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- OpenAI API key (for AI features)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/financial-ai.git
cd financial-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Firebase and other credentials:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

# OpenAI (for AI features)
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key

# Optional - Stripe (for premium features)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses Firebase Firestore with the following main collections:

### Users Collection
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Transactions Collection
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: timestamp;
  createdAt: timestamp;
  updatedAt?: timestamp;
}
```

### Categories Collection
```typescript
interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  createdAt: timestamp;
  updatedAt?: timestamp;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. #   f i n a n c i a l - a i  
 