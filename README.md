# Apple Stocks but Better

A stocks app built with React Native and Expo. It looks like the iOS Stocks app and adds an AI co-trader panel, dip markers on the chart, and a filtered news feed.

## Features

- Main stock view with an SVG price chart you can drag to scrub
- Co-trader panel with a bull case and a bear case, confidence scores, and buy/sell buttons
- Dip markers on the chart that open a short explanation of the drop
- Portfolio tab with holdings, buy/sell, and profit and loss
- Watchlist with small sparkline charts
- News tab that sorts headlines into signal and noise
- Haptics on iOS and Android
- Dark theme

All data is mock data in `data/mockData.js`.

## Running it

```bash
git clone https://github.com/Abdul-jaybar/apple-stocks-ai.git
cd apple-stocks-ai
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `w` to open it in the browser. On a wide browser window the app is shown inside a phone frame.

## Stack

- React Native 0.83
- Expo SDK 55
- react-native-svg for charts
- expo-haptics
- react-native-safe-area-context

## Folders

```
App.js            tab navigation and app state
screens/          Stocks, Portfolio and News screens
components/       chart, header, sheets, watchlist row, news cards, toast
data/mockData.js  mock prices, holdings, scenarios and news
styles/theme.js   colors, spacing and type
```

## License

MIT
