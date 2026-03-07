// Wealthsimple AI Co-Trader Demo - All mock data
// Centered on Wealthsimple (WS) as the hero demo stock

// ---------- USER PROFILE ----------
export const userProfile = {
    name: 'Alex',
    strategy: 'Long-Term (10+ years)',
    riskTolerance: 'Moderate',
    totalCash: 15420.00,
};

// ---------- WEALTHSIMPLE CHART DATA (HERO STOCK) ----------
// 90 data points for a realistic intraday chart
// Includes defined dip zones that trigger AI insight markers
export function generateWSChartData() {
    const points = [];
    const dipIndices = []; // track where dips happen

    // Morning rally: 0-25
    let price = 184.20;
    for (let i = 0; i < 25; i++) {
        price += 0.40 + (Math.sin(i * 0.5) * 0.3) + (Math.random() - 0.45) * 0.4;
        points.push(parseFloat(price.toFixed(2)));
    }

    // First dip: 25-35 (earnings rumor)
    for (let i = 0; i < 10; i++) {
        price -= 0.60 + (Math.random() * 0.3);
        points.push(parseFloat(price.toFixed(2)));
    }
    dipIndices.push({ index: 30, label: 'Earnings rumor sell-off', type: 'dip' });

    // Recovery: 35-50
    for (let i = 0; i < 15; i++) {
        price += 0.30 + (Math.random() - 0.4) * 0.3;
        points.push(parseFloat(price.toFixed(2)));
    }

    // Plateau: 50-60
    for (let i = 0; i < 10; i++) {
        price += (Math.random() - 0.5) * 0.4;
        points.push(parseFloat(price.toFixed(2)));
    }

    // Second dip: 60-72 (market-wide sell-off)
    for (let i = 0; i < 12; i++) {
        const t = i / 11;
        const eased = t * t;
        price -= 0.50 + eased * 0.8;
        points.push(parseFloat(price.toFixed(2)));
    }
    dipIndices.push({ index: 66, label: 'Market-wide sell-off', type: 'dip' });

    // Slight bounce: 72-80
    for (let i = 0; i < 8; i++) {
        price += 0.20 + (Math.random() - 0.4) * 0.2;
        points.push(parseFloat(price.toFixed(2)));
    }

    // Sharp final drop: 80-90
    for (let i = 0; i < 10; i++) {
        const t = i / 9;
        price -= 0.40 + t * 1.2;
        points.push(parseFloat(price.toFixed(2)));
    }
    dipIndices.push({ index: 85, label: 'Analyst downgrade', type: 'dip' });

    return { points, dipIndices };
}

const wsChart = generateWSChartData();

export const heroStock = {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: wsChart.points[wsChart.points.length - 1],
    previousClose: 184.20,
    get change() { return parseFloat((this.price - this.previousClose).toFixed(2)); },
    get changePercent() { return parseFloat(((this.change / this.previousClose) * 100).toFixed(2)); },
    get isPositive() { return this.change >= 0; },
    chartData: wsChart.points,
    dipMarkers: wsChart.dipIndices,
    open: 184.18,
    dayHigh: 189.95,
    dayLow: wsChart.points[wsChart.points.length - 1],
    volume: '52.8M',
    avgVolume: '68.1M',
    marketCap: '2.8T',
    peRatio: 28.2,
    high52w: 199.62,
    low52w: 164.08,
};

// ---------- SPARKLINE GENERATOR ----------
function generateSparkline(trend, volatility = 1) {
    const points = [];
    let value = 50;
    for (let i = 0; i < 20; i++) {
        value += trend * 0.5 + (Math.random() - 0.5) * volatility * 3;
        points.push(Math.max(0, Math.min(100, value)));
    }
    return points;
}

// ---------- WATCHLIST ----------
export const watchlist = [
    {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        price: 189.84,
        change: -8.32,
        changePercent: -4.20,
        isPositive: false,
        sparkline: generateSparkline(-0.5, 1.2),
    },
    {
        ticker: 'TSLA',
        name: 'Tesla, Inc.',
        price: 248.42,
        change: 4.44,
        changePercent: 1.82,
        isPositive: true,
        sparkline: generateSparkline(1, 1.5),
    },
    {
        ticker: 'MSFT',
        name: 'Microsoft Corporation',
        price: 378.91,
        change: -2.06,
        changePercent: -0.54,
        isPositive: false,
        sparkline: generateSparkline(-0.3, 0.8),
    },
    {
        ticker: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 141.80,
        change: 0.44,
        changePercent: 0.31,
        isPositive: true,
        sparkline: generateSparkline(0.5, 0.6),
    },
];

// ---------- PORTFOLIO HOLDINGS ----------
export const initialPortfolio = [
    {
        id: '1',
        ticker: 'WS',
        name: 'Wealthsimple Inc.',
        shares: 350,
        avgCost: 12.40,
        currentPrice: heroStock.price,
        position: 'long',
        holdingSince: 'Jan 2024',
        targetPrice: 20.00,
        stopLoss: 10.50,
    },
    {
        id: '2',
        ticker: 'AAPL',
        name: 'Apple Inc.',
        shares: 25,
        avgCost: 165.20,
        currentPrice: 189.84,
        position: 'long',
        holdingSince: 'Mar 2023',
        targetPrice: 250.00,
        stopLoss: 155.00,
    },
    {
        id: '3',
        ticker: 'TSLA',
        name: 'Tesla, Inc.',
        shares: 15,
        avgCost: 220.50,
        currentPrice: 248.42,
        position: 'short',
        holdingSince: 'Nov 2024',
        targetPrice: 180.00,
        stopLoss: 275.00,
    },
];

// ---------- DEEP STATS (AAPL-specific) ----------
export const deepStats = {
    rsi: 28,
    rsiLabel: 'Oversold',
    movingAvg200: 181.80,
    below200MA: false,
    peRatio: 28.2,
    peSixMonthAvg: 30.1,
    peDiscount: true,
    institutionalHolding: 0.62,
    revenueGrowth: 0.08,
    userGrowth: 0.05,
    historicalRecoveryDays: 14,
    aum: '2.8T',
    aumGrowth: 0.12,
};

// ---------- AI SCENARIOS (AAPL-specific) ----------
export const aiScenarios = {
    bullCase: {
        title: 'Long-Term Bull Case',
        confidence: 74,
        signals: [
            {
                icon: '📊',
                label: 'RSI Signal',
                detail: `RSI is ${deepStats.rsi} (deeply oversold). AAPL has bounced from similar levels in ${deepStats.historicalRecoveryDays} days historically.`,
            },
            {
                icon: '📈',
                label: 'Growth',
                detail: `Revenue up ${Math.round(deepStats.revenueGrowth * 100)}% YoY. User growth at ${Math.round(deepStats.userGrowth * 100)}% — fastest in Canadian fintech.`,
            },
            {
                icon: '🏦',
                label: 'AUM',
                detail: `Assets under management at $${deepStats.aum}, up ${Math.round(deepStats.aumGrowth * 100)}% — strong money inflow signal.`,
            },
            {
                icon: '💰',
                label: 'Valuation',
                detail: `P/E at ${deepStats.peRatio}x vs 6-month avg of ${deepStats.peSixMonthAvg}x — trading at a significant discount.`,
            },
        ],
    },
    bearCase: {
        title: 'Bear Thesis',
        confidence: 26,
        signals: [
            {
                icon: '⚠️',
                label: 'Competition',
                detail: 'Increased competition from big banks launching zero-fee trading platforms.',
            },
            {
                icon: '📉',
                label: 'Technical',
                detail: `Trading below 200-day MA ($${deepStats.movingAvg200}). Analyst downgrade adding selling pressure.`,
            },
        ],
    },
};

// ---------- DIP INSIGHTS (shown when pressing dip icon on chart) ----------
export const dipInsights = [
    {
        dipIndex: 30,
        headline: 'Earnings Rumor: Services Revenue Miss Speculated',
        detail: 'Unverified reports suggest Apple may miss Q4 services revenue estimates by 3%. However, hardware sales remain strong.',
        aiVerdict: 'Low Impact',
        aiColor: '#FF9F0A',
        relevance: 'Your LONG position (350 shares) is well above the avg cost of $165.20. This rumor is unverified — hold steady.',
    },
    {
        dipIndex: 66,
        headline: 'Market-Wide Sell-Off Hits Tech Sector',
        detail: 'Broad market correction triggered by Fed rate concerns. All big tech stocks down 3-7%. Not AAPL-specific.',
        aiVerdict: 'Noise',
        aiColor: '#34C759',
        relevance: 'Sector-wide event. AAPL fundamentals unchanged. Your 10+ year horizon makes this irrelevant. Consider adding.',
    },
    {
        dipIndex: 85,
        headline: 'Analyst Downgrade: Price Target Cut to $175',
        detail: 'Wall Street analyst cuts AAPL from "Buy" to "Hold", citing near-term margin compression from new AI server costs.',
        aiVerdict: 'Watch Closely',
        aiColor: '#FF3B30',
        relevance: 'Approaching your avg cost ($165.20). Stop-loss at $150.50. The new AI features are a growth investment — short-term pain for long-term gain.',
    },
];

// ---------- AI NEWS FEED ----------
export const aiNewsItems = [
    {
        id: '1',
        source: 'AI Assessment',
        sourceIcon: '✦',
        isAI: true,
        timestamp: '1h ago',
        headline: 'AI Assessment: Buying Opportunity.',
        summary: `You hold AAPL long-term (350 shares). Today's dip is driven by an analyst downgrade + sector sell-off, but Services revenue is up 12% and iPhone sales are solid. RSI at 28 signals oversold. Consider adding to your position.`,
        relevanceScore: 97,
        tag: 'Personalized for Alex',
    },
    {
        id: '2',
        source: 'Market Analysis',
        sourceIcon: '◆',
        isAI: false,
        timestamp: '2h ago',
        headline: 'Wealthsimple AUM Hits Record $45B Despite Market Dip',
        summary: 'Assets under management grew 22% year-over-year, driven by strong inflows from the 18-35 demographic and the new premium subscription tier.',
        relevanceScore: 88,
        tag: 'Fundamentals',
    },
    {
        id: '3',
        source: 'Competitor Watch',
        sourceIcon: '◇',
        isAI: false,
        timestamp: '4h ago',
        headline: 'Big Bank Zero-Fee Launch Delayed to Q3',
        summary: 'RBC\'s planned zero-commission trading platform has been pushed back, giving WS an extended competitive window in the Canadian market.',
        relevanceScore: 75,
        tag: 'Competitive Intel',
    },
    {
        id: '4',
        source: 'Technical Signal',
        sourceIcon: '◈',
        isAI: false,
        timestamp: '5h ago',
        headline: 'RSI at 28 — Historically Bullish for WS',
        summary: 'Current RSI level has preceded 15%+ rebounds in 7 of the last 9 instances. Average recovery period: 18 trading days.',
        relevanceScore: 82,
        tag: 'Technical',
    },
];
