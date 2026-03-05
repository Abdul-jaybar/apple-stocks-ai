import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import StocksScreen from './screens/StocksScreen';
import PortfolioScreen from './screens/PortfolioScreen';
import CoTraderSheet from './components/CoTraderSheet';
import DipInsightSheet from './components/DipInsightSheet';
import Toast from './components/Toast';
import { initialPortfolio, userProfile, heroStock } from './data/mockData';
import { colors, typography, spacing, borderRadius } from './styles/theme';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const IPHONE_WIDTH = 390;
const IPHONE_HEIGHT = 844;

export default function App() {
  // ---- STATE ----
  const [activeTab, setActiveTab] = useState('stocks');
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [cash, setCash] = useState(userProfile.totalCash);

  // Sheets
  const [coTraderVisible, setCoTraderVisible] = useState(false);
  const [coTraderHolding, setCoTraderHolding] = useState(null);
  const [dipSheetVisible, setDipSheetVisible] = useState(false);
  const [dipSheetIndex, setDipSheetIndex] = useState(null);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // ---- TOAST ----
  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  // ---- CO-TRADER ----
  const openCoTrader = useCallback((holding) => {
    const h = holding || portfolio.find(p => p.ticker === 'WS');
    setCoTraderHolding(h || null);
    setCoTraderVisible(true);
  }, [portfolio]);

  // ---- BUY ----
  const handleBuy = useCallback((ticker, shares) => {
    const price = ticker === 'WS' ? heroStock.price : 100;
    const cost = shares * price;

    if (cost > cash) {
      showToast(`Insufficient cash ($${cash.toFixed(0)} available)`, 'error');
      return;
    }

    setPortfolio(prev => {
      const existing = prev.find(h => h.ticker === ticker);
      if (existing) {
        return prev.map(h => {
          if (h.ticker === ticker) {
            const newShares = h.shares + shares;
            const newAvgCost = ((h.shares * h.avgCost) + (shares * price)) / newShares;
            return { ...h, shares: newShares, avgCost: parseFloat(newAvgCost.toFixed(2)) };
          }
          return h;
        });
      }
      return [...prev, {
        id: String(Date.now()),
        ticker, name: 'Wealthsimple Inc.', shares, avgCost: price,
        currentPrice: price, position: 'long', holdingSince: 'Today',
        targetPrice: price * 1.3, stopLoss: price * 0.85,
      }];
    });
    setCash(prev => parseFloat((prev - cost).toFixed(2)));
    showToast(`Bought ${shares} shares of ${ticker} at $${price.toFixed(2)}`, 'success');
  }, [cash, showToast]);

  // ---- SELL ----
  const handleSell = useCallback((ticker, shares) => {
    const holding = portfolio.find(h => h.ticker === ticker);
    if (!holding || shares > holding.shares) {
      showToast('Invalid sell order', 'error');
      return;
    }

    const price = holding.currentPrice;
    const revenue = shares * price;

    setPortfolio(prev => {
      if (shares >= holding.shares) {
        return prev.filter(h => h.ticker !== ticker);
      }
      return prev.map(h => {
        if (h.ticker === ticker) return { ...h, shares: h.shares - shares };
        return h;
      });
    });
    setCash(prev => parseFloat((prev + revenue).toFixed(2)));

    if (shares >= holding.shares) {
      showToast(`Closed ${ticker} position — $${revenue.toFixed(2)} received`, 'warning');
    } else {
      showToast(`Sold ${shares} shares of ${ticker} — $${revenue.toFixed(2)} received`, 'success');
    }
  }, [portfolio, showToast]);

  // ---- DIP INSIGHT ----
  const handleDipPress = useCallback((dip) => {
    setDipSheetIndex(dip.index);
    setDipSheetVisible(true);
  }, []);

  // ---- PORTFOLIO ACTIONS ----
  const handlePortfolioAnalyze = useCallback((holding) => {
    openCoTrader(holding);
  }, [openCoTrader]);

  const handlePortfolioSell = useCallback((holding) => {
    setCoTraderHolding(holding);
    setCoTraderVisible(true);
  }, []);

  // ---- RENDER ----
  const appContent = (
    <View style={styles.appContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Screen content */}
        <View style={styles.screenContainer}>
          {activeTab === 'stocks' ? (
            <StocksScreen
              portfolio={portfolio}
              onOpenCoTrader={openCoTrader}
              onShowToast={showToast}
              onDipPress={handleDipPress}
            />
          ) : (
            <PortfolioScreen
              portfolio={portfolio}
              cash={cash}
              onAnalyze={handlePortfolioAnalyze}
              onSell={handlePortfolioSell}
            />
          )}
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('stocks')} activeOpacity={0.6}>
            <Text style={[styles.tabIcon, activeTab === 'stocks' && styles.tabIconActive]}>📈</Text>
            <Text style={[styles.tabLabel, activeTab === 'stocks' && styles.tabLabelActive]}>Stocks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('portfolio')} activeOpacity={0.6}>
            <Text style={[styles.tabIcon, activeTab === 'portfolio' && styles.tabIconActive]}>💼</Text>
            <Text style={[styles.tabLabel, activeTab === 'portfolio' && styles.tabLabelActive]}>Portfolio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Overlays */}
      <CoTraderSheet
        visible={coTraderVisible}
        onClose={() => setCoTraderVisible(false)}
        onBuy={handleBuy}
        onSell={handleSell}
        holding={coTraderHolding}
      />
      <DipInsightSheet
        visible={dipSheetVisible}
        onClose={() => setDipSheetVisible(false)}
        dipIndex={dipSheetIndex}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );

  // On web, wrap in iPhone frame for demo presentation
  if (Platform.OS === 'web' && WINDOW_WIDTH > IPHONE_WIDTH + 40) {
    return (
      <SafeAreaProvider>
        <View style={styles.webBackground}>
          {/* iPhone frame */}
          <View style={styles.iphoneFrame}>

            {/* App content inside frame */}
            <View style={styles.iphoneScreen}>
              {appContent}
            </View>
            {/* Home indicator */}
            <View style={styles.homeIndicatorBar}>
              <View style={styles.homeIndicator} />
            </View>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  // On mobile / narrow screen, render full screen
  return <SafeAreaProvider>{appContent}</SafeAreaProvider>;
}

const styles = StyleSheet.create({
  // --- Web iPhone frame ---
  webBackground: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iphoneFrame: {
    width: IPHONE_WIDTH,
    height: IPHONE_HEIGHT,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#333',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: { boxShadow: '0px 20px 40px rgba(0,0,0,0.5)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 40,
      },
    }),
  },

  iphoneScreen: {
    flex: 1,
    paddingTop: 12,
  },
  homeIndicatorBar: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#333',
  },

  // --- App layout ---
  appContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  screenContainer: {
    flex: 1,
  },

  // --- Tab Bar ---
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.systemBlue,
  },
});
