import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../styles/theme';

export default function StockHeader({ stock }) {
    const changeColor = stock.isPositive ? colors.stockGreen : colors.stockRed;
    const arrow = stock.isPositive ? '▲' : '▼';
    const sign = stock.isPositive ? '+' : '';

    return (
        <View style={styles.container}>
            <Text style={styles.ticker}>{stock.ticker}</Text>
            <Text style={styles.companyName}>{stock.name}</Text>
            <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
            <View style={styles.changeRow}>
                <Text style={[styles.changeText, { color: changeColor }]}>
                    {arrow} {sign}{stock.change.toFixed(2)} ({sign}{stock.changePercent.toFixed(2)}%)
                </Text>
                <Text style={styles.changeLabel}> Today</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xs,
    },
    ticker: {
        ...typography.caption1,
        color: colors.textSecondary,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    companyName: {
        ...typography.title2,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    price: {
        ...typography.priceHero,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        ...typography.subheadline,
        fontWeight: '500',
    },
    changeLabel: {
        ...typography.subheadline,
        color: colors.textSecondary,
    },
});
