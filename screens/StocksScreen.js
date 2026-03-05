import React from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { heroStock, watchlist, aiNewsItems } from '../data/mockData';
import StockHeader from '../components/StockHeader';
import StockChart from '../components/StockChart';
import WatchlistItem from '../components/WatchlistItem';
import NewsFeed from '../components/NewsFeed';

export default function StocksScreen({ onOpenCoTrader, onShowToast, onDipPress, portfolio }) {
    const stock = heroStock;
    // Get WS holding from portfolio
    const wsHolding = portfolio.find(h => h.ticker === 'WS');

    const openCoTrader = async () => {
        if (Platform.OS !== 'web') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onOpenCoTrader(wsHolding);
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}
                bounces showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.topNav}>
                    <Text style={styles.dateText}>{dateStr}</Text>
                    <Text style={styles.screenTitle}>Apple Stocks <Text style={styles.screenTitleAi}>but Better</Text></Text>
                </View>

                {/* Stock Detail */}
                <StockHeader stock={stock} />

                {/* Holdings badge + Co-Trader button */}
                <View style={styles.badgeRow}>
                    {wsHolding && (
                        <View style={styles.holdingBadge}>
                            <Text style={styles.holdingBadgeText}>
                                {wsHolding.shares} shares · {wsHolding.position.toUpperCase()} · Avg ${wsHolding.avgCost.toFixed(2)}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity onPress={openCoTrader} activeOpacity={0.7} style={styles.coTraderButton}>
                        <Text style={styles.coTraderIcon}>✦</Text>
                        <Text style={styles.coTraderLabel}>Co-Trader</Text>
                    </TouchableOpacity>
                </View>

                {/* Chart with dip markers */}
                <StockChart
                    data={stock.chartData}
                    isPositive={stock.isPositive}
                    dipMarkers={stock.dipMarkers}
                    onDipPress={(dip) => onDipPress(dip)}
                />

                {/* Stats */}
                <View style={styles.statsRow}>
                    <StatItem label="Open" value={`$${stock.open}`} />
                    <StatItem label="High" value={`$${stock.dayHigh}`} />
                    <StatItem label="Low" value={`$${stock.dayLow}`} />
                    <StatItem label="Vol" value={stock.volume} />
                </View>

                <View style={styles.sectionSeparator} />

                {/* Watchlist */}
                <View style={styles.watchlistSection}>
                    <Text style={styles.watchlistTitle}>Watchlist</Text>
                    {watchlist.map((item, index) => (
                        <WatchlistItem key={item.ticker} item={item} isLast={index === watchlist.length - 1}
                            onPress={() => onShowToast(`${item.ticker} · $${item.price.toFixed(2)} · ${item.isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`, 'info')} />
                    ))}
                </View>

                <View style={styles.sectionSeparator} />

                {/* AI News */}
                <NewsFeed items={aiNewsItems} onShowToast={onShowToast} />

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

function StatItem({ label, value }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: 12 },
    topNav: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
    dateText: { ...typography.footnote, color: colors.textSecondary, marginBottom: spacing.xs },
    screenTitle: { ...typography.largeTitle, color: colors.textPrimary },
    screenTitleAi: { ...typography.largeTitle, color: colors.aiGlow, fontStyle: 'italic' },
    badgeRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: spacing.xs, marginBottom: spacing.xs, alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
    holdingBadge: {
        backgroundColor: colors.cardBackground, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        borderRadius: borderRadius.pill, borderWidth: 1, borderColor: colors.separator,
    },
    holdingBadgeText: { ...typography.caption1, color: colors.textSecondary, fontWeight: '600' },
    coTraderButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: colors.aiGlowDim,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.pill,
        minHeight: 44, minWidth: 44,
    },
    coTraderIcon: { fontSize: 16, color: colors.aiGlow, marginRight: spacing.xs },
    coTraderLabel: { ...typography.subheadline, color: colors.aiGlow, fontWeight: '600' },
    statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, justifyContent: 'space-between' },
    statItem: { alignItems: 'center' },
    statLabel: { ...typography.caption2, color: colors.textTertiary, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600' },
    sectionSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginHorizontal: spacing.lg, marginVertical: spacing.sm },
    watchlistSection: { paddingTop: spacing.sm },
    watchlistTitle: { ...typography.title2, color: colors.textPrimary, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
});
