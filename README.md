# SoulSpace 🌿

SoulSpace is a peaceful sanctuary for mood journaling, inner growth, and daily affirmations. Designed as a privacy-first web application, it helps you cultivate mindfulness through features like a growing Peace Garden, a Peace Jar of affirmations, and calming background music.

> **Note**: All your data (journal entries, growth progress) is stored locally in your browser for complete privacy.

---

## ✨ Features

- **📖 Mood Journal**: Record your daily thoughts and feelings. Entries are saved locally, ensuring your personal reflections stay private.
- **🌳 Peace Garden**: Visual gamification of your mindfulness journey. Your garden grows from a seed to a flowering tree based on your consistency.
    - *Stages*: Seedling → Sprout → Sapling → Tree → Flowering Tree
- **𫸹 Peace Jar**: Draw random affirmations and quotes to boost your mood or find calm.
- **🎵 Music Player**: Integrated calming tracks like "Samay Samjhayega" and "Tum Prem Ho" to enhance your experience.
- **📱 Responsive Design**: A beautiful, fluid interface that works seamlessly on desktop and mobile.

---

## 🛠️ Tech Stack

Built with the latest modern web technologies:

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev) & [React Icons](https://react-icons.github.io/react-icons/)
- **Storage**: Browser LocalStorage (No backend database required)

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd soulspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
soulspace/
├── app/                  # Next.js App Router pages & layouts
│   ├── layout.js         # Root layout & global settings
│   ├── page.js           # Home page combining all components
│   └── globals.css       # Global styles & Tailwind directives
├── components/           # UI Components
│   ├── Header.js         # Navigation header
│   ├── Footer.js         # Page footer
│   ├── MoodJournal.js    # Journaling logic & storage
│   ├── PeaceGarden.js    # Growth visualization logic
│   ├── PeaceJar.js       # Random quote generator
│   ├── MusicPlayer.js    # Audio player with playlist
│   └── WelcomePage.js    # Intro screen
├── public/               # Static assets (icons, music files)
└── ...config files       # Next.js, Tailwind, ESLint configs
```

---

## 📄 License

This project is licensed under the MIT License.
