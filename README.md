# TypeTest - Typing Speed Test

A modern, production-ready typing speed test application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Typing Engine
- **Multiple Test Modes**: Time-based (15s, 30s, 60s, 2min, 5min) and word-count (10, 25, 50, 100 words)
- **Smart Highlighting**: Character, word, or caret highlighting modes
- **Real-time Statistics**: Live WPM, accuracy, and progress tracking
- **Error Handling**: Comprehensive error tracking with "error until corrected" behavior
- **Backspace Support**: Full correction capabilities without jumping across words

### Analytics & Results
- **WPM Calculation**: Industry-standard WPM formula (correct characters ÷ 5 ÷ time in minutes)
- **Accuracy Tracking**: Real-time accuracy percentage
- **Progress Charts**: Visual representation of WPM over time using Recharts
- **Result History**: Local storage for past test results with filtering and search
- **Share Results**: Copy test summaries to clipboard

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Theme**: System theme detection with manual toggle
- **Smooth Animations**: Framer Motion for subtle transitions and feedback
- **Accessibility**: Proper focus management and screen reader support
- **Keyboard Navigation**: Full keyboard-only operation

### Word Lists
- **Simple Words**: Common English vocabulary for beginners
- **Advanced Words**: Complex terminology for experienced typists
- **Random Selection**: Unique passages for each test

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix Primitives
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theming**: next-themes

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Hero landing page
│   ├── test/page.tsx      # Main typing test interface
│   ├── results/page.tsx   # Test results and history
│   ├── leaderboard/page.tsx # Mock leaderboard
│   └── about/page.tsx     # About and help information
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation bar
│   ├── footer.tsx        # Footer component
│   └── typing/           # Typing-specific components
│       ├── TypingPanel.tsx    # Main typing interface
│       ├── StatsBar.tsx       # Live statistics display
│       └── Controls.tsx       # Test configuration controls
├── lib/                  # Utility functions and data
│   ├── words/            # Word lists for tests
│   ├── typingEngine.ts   # Typing logic and calculations
│   └── storage.ts        # Local storage utilities
├── store/                # State management
│   └── useTypingStore.ts # Zustand store for typing state
└── hooks/                # Custom React hooks
    └── useInterval.ts    # Interval management hook
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd typingwebsite
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
pnpm start
```

## 🎯 Usage

### Taking a Test

1. **Navigate to the Test Page**: Click "Start 60s Test" from the hero or go to `/test`
2. **Configure Settings**: Choose test mode, duration, word list, and highlighting style
3. **Begin Typing**: Click on the text panel and start typing
4. **View Results**: See live statistics and final results summary

### Viewing Results

- **Results Page**: View all past test results with filtering options
- **Charts**: Visual progress tracking over time
- **Export**: Share results via clipboard

### Customization

- **Test Modes**: Switch between time-based and word-count tests
- **Word Lists**: Choose between simple and advanced vocabulary
- **Highlighting**: Select character, word, or caret highlighting
- **Theme**: Toggle between light, dark, and system themes

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The app uses local storage for data persistence.

### Customization Options

- **Word Lists**: Add custom words to `src/lib/words/`
- **Test Durations**: Modify available time options in `src/components/typing/Controls.tsx`
- **Styling**: Customize Tailwind classes and CSS variables
- **Animations**: Adjust Framer Motion settings

## 📊 Performance

- **Optimized Rendering**: React.memo for performance-critical components
- **Efficient State**: Zustand for minimal re-renders
- **Lazy Loading**: Dynamic imports for heavy components
- **Bundle Optimization**: Tree-shaking and code splitting

## 🧪 Testing

The application includes comprehensive typing test functionality:

- **Real-time WPM calculation**
- **Accuracy tracking**
- **Error handling and correction**
- **Progress visualization**
- **Result persistence**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful, accessible components
- **Radix UI** for robust primitives
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Recharts** for data visualization

## 📞 Support

For questions, issues, or contributions, please open an issue on GitHub or contact the development team.

---

**Happy Typing! 🚀**
