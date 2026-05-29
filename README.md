# 🎓 CampusNova

**India's Premium Student Marketplace** — Buy & Sell Books, Notes & Study Materials

Built with ❤️ for Indian students across 100+ colleges

---

## ✨ Features

- 📚 **25+ Categories** — School Books, CBSE, GSEB, ICSE, College Books, Medical, Engineering, Competitive Exams & more
- 🛒 **Buy, Sell & Exchange** — List items for sale, exchange, or giveaway
- 📖 **Book Reader** — Built-in PDF viewer with bookmark support
- 🎯 **Smart Search** — Filter by category, city, course, semester, board & condition
- 💬 **WhatsApp Integration** — Direct contact with sellers via WhatsApp
- 🌙 **Dark Mode** — Beautiful light & dark themes
- 📱 **Mobile First** — Responsive design with bottom navigation
- 🔒 **Secure** — Input sanitization, rate limiting, file validation

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React Framework (App Router) |
| **TypeScript** | Type Safety |
| **Tailwind CSS 4** | Styling |
| **Prisma ORM** | Database (SQLite) |
| **Zustand** | State Management |
| **shadcn/ui** | UI Components |
| **Framer Motion** | Animations |
| **Sonner** | Toast Notifications |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/disciplineembrace/campusnova.git
cd campusnova

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

| Email | Name | Role |
|---|---|---|
| arjun@iitd.ac.in | Arjun Sharma | Admin |
| priya@aiims.ac.in | Priya Patel | Verified Seller |
| rahul@iisc.ac.in | Rahul Verma | Top Seller |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication
│   │   ├── listings/      # CRUD Listings
│   │   ├── upload/        # Image Upload
│   │   ├── seed/          # Database Seeding
│   │   └── ...
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # SPA Entry Point
│   └── globals.css        # Global Styles
├── components/
│   ├── campus/            # App Pages & Components
│   └── ui/                # shadcn/ui Components
├── lib/
│   ├── store.ts           # Zustand Store
│   ├── db.ts              # Prisma Client
│   └── utils.ts           # Utilities
└── public/
    └── uploads/           # User Uploaded Images
```

## 🎨 Design System

- **Primary Blue**: `#2563EB`
- **Purple**: `#7C3AED`
- **Cyan**: `#06B6D4`
- **Background**: `#F8FAFC`
- **Dark**: `#0F172A`
- **Fonts**: Poppins (Headings) + Inter (Body)

## 📄 License

MIT License — Free to use and modify.

---

Made with 💙 by [Pradip1137s](https://github.com/disciplineembrace)
