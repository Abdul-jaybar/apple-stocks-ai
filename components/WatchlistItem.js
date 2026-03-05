import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const SPARKLINE_WIDTH = 60;
const SPARKLINE_HEIGHT = 28;

function buildSparklinePath(data) {
    if (!data || data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = SPARKLINE_WIDTH / (data.length - 1);

    let path = `M 0 ${SPARKLINE_HEIGHT - ((data[0] - min) / range) * SPARKLINE_HEIGHT}`;
    for (let i = 1; i < data.length; i++) {
        const x = i * stepX;
        const y = SPARKLINE_HEIGHT - ((data[i] - min) / range) * SPARKLINE_HEIGHT;
        path += ` L ${x} ${y}`;
    }
    return path;
}

export default function WatchlistItem({ item, isLast, onPress }) {
    const changeColor = item.isPositive ? colors.stockGreen : colors.stockRed;
    const changeBackground = item.isPositive ? colors.stockGreenDim : colors.stockRedDim;
    const sign = item.isPositive ? '+' : '';
    const sparklinePath = buildSparklinePath(item.sparkline);

    return (
        <TouchableOpacity activeOpacity={0.6} style={styles.container} onPress={onPress}>
            <View style={styles.leftSection}>
                <Text style={styles.ticker}>{item.ticker}</Text>
                <Text style={styles.companyName} numberOfLines={1}>{item.name}</Text>
            </View>

            <View style={styles.sparklineContainer}>
                <Svg width={SPARKLINE_WIDTH} height={SPARKLINE_HEIGHT}>
                    <Path
                        d={sparklinePath}
                        stroke={changeColor}
                        strokeWidth={1.5}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </View>

            <View style={[styles.priceButton, { backgroundColor: changeColor }]}>
                <Text style={styles.priceText}>{item.price.toFixed(2)}</Text>
            </View>

            {!isLast && <View style={styles.separator} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        minHeight: 64,
    },
    leftSection: {
        flex: 1,
        marginRight: spacing.md,
    },
    ticker: {
        ...typography.headline,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    companyName: {
        ...typography.caption1,
        color: colors.textSecondary,
    },
    sparklineContainer: {
        width: SPARKLINE_WIDTH,
        height: SPARKLINE_HEIGHT,
        marginRight: spacing.lg,
        justifyContent: 'center',
    },
    priceButton: {
        minWidth: 75,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        alignItems: 'flex-end',
    },
    priceText: {
        ...typography.subheadline,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    separator: {
        position: 'absolute',
        bottom: 0,
        left: spacing.lg,
        right: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.separator,
    },
});
