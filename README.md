# 📈 Wealthsimple Stock Clone — AI Co-Trader

A pixel-perfect **Wealthsimple / Apple Stocks** clone built with **React Native + Expo**, featuring an AI Co-Trader bottom sheet and intelligent news feed.

![React Native](https://img.shields.io/badge/React_Native-0.83-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo_SDK-55-black?logo=expo)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Hero Stock View** — Real-time price display with dynamic SVG chart, gradient fills, and touch-to-scrub interaction
- **AI Co-Trader** — Bottom sheet with bull/bear scenario cards, confidence indicators, and actionable buy/sell buttons
- **Dip Insight Markers** — Tappable chart markers that reveal AI-driven analysis on price dips
- **Portfolio Management** — Track holdings, buy/sell stocks, and view P&L with real-time updates
- **Watchlist** — Mini sparkline charts with live pricing for tracked stocks
- **AI News Feed** — "Signal vs. Noise" filtered news with AI assessment badges
- **Haptic Feedback** — Native haptics on button interactions (iOS/Android)
- **Dark Mode** — Pure black OLED-friendly theme matching iOS Human Interface Guidelines

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Abdul-jaybar/apple-stocks-ai.git
cd apple-stocks-ai

# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```

Scan the QR code with **Expo Go** on your phone (same Wi-Fi network).

## 📱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.83 |
| Platform | Expo SDK 55 |
| Charts | react-native-svg |
| Haptics | expo-haptics |
| Safe Areas | react-native-safe-area-context |
| Bottom Sheets | Custom Modal + Animated + PanResponder |

## 📂 Project Structure

```
├── App.js                  # Root component with tab navigation
├── screens/
│   ├── StocksScreen.js     # Main stocks view with chart + watchlist
│   └── PortfolioScreen.js  # Portfolio holdings and P&L
├── components/
│   ├── StockChart.js       # SVG line chart with gradient + scrubber
│   ├── StockHeader.js      # Ticker, price, and change display
│   ├── CoTraderSheet.js    # AI Co-Trader bottom sheet
│   ├── DipInsightSheet.js  # Dip marker insight overlay
│   ├── WatchlistItem.js    # Watchlist row with sparkline
│   ├── NewsFeed.js         # AI-filtered news cards
│   └── Toast.js            # Notification toasts
├── data/
│   └── mockData.js         # Mock stock data, AI scenarios, news
└── styles/
    └── theme.js            # iOS-style design system tokens
```

## 📄 License

MIT
