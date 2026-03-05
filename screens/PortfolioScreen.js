import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

function HoldingCard({ holding, onAnalyze, onSell }) {
    const isLong = holding.position === 'long';
    const marketValue = holding.shares * holding.currentPrice;
    const costBasis = holding.shares * holding.avgCost;
    const totalReturn = marketValue - costBasis;
    const totalReturnPct = (totalReturn / costBasis) * 100;
    const isProfit = isLong ? totalReturn > 0 : totalReturn < 0;
    const displayReturn = isLong ? totalReturn : -totalReturn;
    const displayReturnPct = isLong ? totalReturnPct : -totalReturnPct;

    return (
        <View style={styles.holdingCard}>
            <View style={styles.holdingHeader}>
                <View style={styles.holdingLeft}>
                    <View style={styles.tickerRow}>
                        <Text style={styles.holdingTicker}>{holding.ticker}</Text>
                        <View style={[styles.positionBadge, isLong ? styles.longBadge : styles.shortBadge]}>
                            <Text style={[styles.positionText, isLong ? styles.longText : styles.shortText]}>
                                {isLong ? '▲ LONG' : '▼ SHORT'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.holdingName}>{holding.name}</Text>
                </View>
                <View style={styles.holdingRight}>
                    <Text style={styles.holdingPrice}>${holding.currentPrice.toFixed(2)}</Text>
                    <Text style={[styles.holdingReturn, { color: isProfit ? colors.stockGreen : colors.stockRed }]}>
                        {isProfit ? '+' : ''}{displayReturn.toFixed(2)} ({isProfit ? '+' : ''}{displayReturnPct.toFixed(1)}%)
                    </Text>
                </View>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statBox}><Text style={styles.statBoxLabel}>Shares</Text><Text style={styles.statBoxValue}>{holding.shares}</Text></View>
                <View style={styles.statBox}><Text style={styles.statBoxLabel}>Avg Cost</Text><Text style={styles.statBoxValue}>${holding.avgCost.toFixed(2)}</Text></View>
                <View style={styles.statBox}><Text style={styles.statBoxLabel}>Mkt Value</Text><Text style={styles.statBoxValue}>${(marketValue / 1000).toFixed(1)}K</Text></View>
                <View style={styles.statBox}><Text style={styles.statBoxLabel}>Since</Text><Text style={styles.statBoxValue}>{holding.holdingSince}</Text></View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity activeOpacity={0.7} style={[styles.holdingActionBtn, styles.holdingActionSecondary]} onPress={() => onAnalyze(holding)}>
                    <Text style={styles.holdingActionText}>✦ AI Analysis</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={[styles.holdingActionBtn, styles.holdingActionRed]} onPress={() => onSell(holding)}>
                    <Text style={styles.holdingActionTextWhite}>{isLong ? 'Sell' : 'Cover'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function PortfolioScreen({ portfolio, cash, onAnalyze, onSell }) {
    const totalMarketValue = portfolio.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
    const totalCostBasis = portfolio.reduce((sum, h) => sum + h.shares * h.avgCost, 0);
    const totalPL = totalMarketValue - totalCostBasis;
    const totalPLPct = totalCostBasis > 0 ? (totalPL / totalCostBasis) * 100 : 0;
    const totalPortfolioValue = totalMarketValue + cash;
    const longCount = portfolio.filter(h => h.position === 'long').length;
    const shortCount = portfolio.filter(h => h.position === 'short').length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces>
            <Text style={styles.screenTitle}>Portfolio</Text>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
                <Text style={styles.summaryValue}>${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryPL, { color: totalPL >= 0 ? colors.stockGreen : colors.stockRed }]}>
                        {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)} ({totalPL >= 0 ? '+' : ''}{totalPLPct.toFixed(1)}%)
                    </Text>
                    <Text style={styles.summaryToday}> All Time</Text>
                </View>
                <View style={styles.breakdownRow}>
                    <View style={styles.breakdownItem}>
                        <View style={[styles.breakdownDot, { backgroundColor: colors.stockGreen }]} />
                        <Text style={styles.breakdownText}>{longCount} Long</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                        <View style={[styles.breakdownDot, { backgroundColor: colors.stockRed }]} />
                        <Text style={styles.breakdownText}>{shortCount} Short</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                        <View style={[styles.breakdownDot, { backgroundColor: colors.textTertiary }]} />
                        <Text style={styles.breakdownText}>${cash.toLocaleString('en-US', { minimumFractionDigits: 0 })} Cash</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Holdings</Text>
            {portfolio.map((h) => (
                <HoldingCard key={h.id} holding={h} onAnalyze={onAnalyze} onSell={onSell} />
            ))}
            <View style={{ height: 80 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingTop: 16, paddingHorizontal: spacing.lg },
    screenTitle: { ...typography.largeTitle, color: colors.textPrimary, marginBottom: spacing.lg },
    summaryCard: { backgroundColor: colors.cardBackground, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.xl },
    summaryLabel: { ...typography.footnote, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.xs },
    summaryValue: { fontSize: 34, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs },
    summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
    summaryPL: { ...typography.subheadline, fontWeight: '600' },
    summaryToday: { ...typography.subheadline, color: colors.textSecondary },
    breakdownRow: { flexDirection: 'row', paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.separator },
    breakdownItem: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.xl },
    breakdownDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
    breakdownText: { ...typography.caption1, color: colors.textSecondary, fontWeight: '600' },
    sectionTitle: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.md },
    holdingCard: { backgroundColor: colors.cardBackground, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
    holdingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
    holdingLeft: { flex: 1 },
    tickerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    holdingTicker: { ...typography.headline, color: colors.textPrimary, marginRight: spacing.sm },
    positionBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
    longBadge: { backgroundColor: colors.stockGreenDim },
    shortBadge: { backgroundColor: colors.stockRedDim },
    positionText: { ...typography.caption2, fontWeight: '700', letterSpacing: 0.5 },
    longText: { color: colors.stockGreen },
    shortText: { color: colors.stockRed },
    holdingName: { ...typography.caption1, color: colors.textSecondary },
    holdingRight: { alignItems: 'flex-end' },
    holdingPrice: { ...typography.headline, color: colors.textPrimary },
    holdingReturn: { ...typography.caption1, fontWeight: '600' },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md, backgroundColor: colors.cardBackgroundElevated, borderRadius: borderRadius.md, padding: spacing.md },
    statBox: { alignItems: 'center' },
    statBoxLabel: { ...typography.caption2, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
    statBoxValue: { ...typography.footnote, color: colors.textPrimary, fontWeight: '600' },
    actionRow: { flexDirection: 'row', gap: spacing.sm },
    holdingActionBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', minHeight: 44, justifyContent: 'center' },
    holdingActionSecondary: { backgroundColor: colors.cardBackgroundElevated, borderWidth: 1, borderColor: colors.separator },
    holdingActionRed: { backgroundColor: colors.stockRed },
    holdingActionText: { ...typography.subheadline, color: colors.aiGlow, fontWeight: '600' },
    holdingActionTextWhite: { ...typography.subheadline, color: '#FFF', fontWeight: '600' },
});
