# Books Shop

A modern, full-stack book management application built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features include book browsing, personal book collection management, multi-language support (English/Arabic), and responsive design.

## Features

- 📚 **Book Browsing**: Search and browse books from Open Library API
- 📖 **My Books**: Personal book collection management
- 🔍 **Advanced Filtering**: Filter by category and price range
- 🌐 **Multi-language Support**: English and Arabic with RTL support
- 🎨 **Dark Mode**: Theme toggle for light/dark mode
- 📱 **Responsive Design**: Mobile-first responsive layout
- 🔐 **Authentication**: Session-based authentication
- ✨ **Real-time Updates**: React Query for efficient data fetching

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand, React Query
- **Form Handling**: React Hook Form with Zod
- **I18n**: Custom i18n implementation

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### 4. Start Production Server

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (protected)/       # Protected routes (require login)
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── layout/           # Layout components (Navbar, etc.)
│   ├── ui/               # UI components (Buttons, Cards, etc.)
│   └── profile/          # Profile-specific components
├── features/              # Feature-based modules
│   └── books/            # Books feature
│       ├── components/    # Book-specific components
│       ├── hooks/        # Custom hooks
│       └── types.ts      # TypeScript types
├── lib/                   # Utility libraries
│   ├── api/              # API utilities
│   ├── auth/             # Authentication utilities
│   ├── i18n/             # Internationalization
│   └── query/            # React Query setup
├── messages/              # Translation files
│   ├── en.json           # English translations
│   └── ar.json           # Arabic translations
└── store/                 # Zustand stores
```

## Authentication

Default credentials:

- **Email**: `admin@books.com`
- **Password**: `admin123`

## Features in Detail

### Book Browsing

- Search books by title, author, or category
- Filter by category (Technology, Science, History, Fantasy, Biography, Other)
- Filter by price range
- Sort by title (A-Z / Z-A)
- Pagination support

### My Books

- Add books from the shop to your personal collection
- Create new books manually
- Edit and delete your books
- Search and filter your collection
- View book details

### Internationalization

- English (LTR) and Arabic (RTL) support
- Language switcher in navbar
- All UI text is translatable
- RTL-aware components

### Responsive Design

- Mobile-first approach
- Responsive navbar with mobile menu
- Adaptive grid layouts
- Touch-friendly interactions

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

No environment variables are required for this project. All data is stored in-memory for demo purposes.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is for educational purposes.

## Notes

- Data is stored in-memory and will reset on server restart
- Open Library API is used for book data
- Session-based authentication (cookies)
- All images are loaded from external sources
