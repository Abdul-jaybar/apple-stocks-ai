import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Line, G } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_HEIGHT = 200;
const CHART_PADDING_TOP = 20;
const CHART_PADDING_BOTTOM = 10;
const TIME_PERIODS = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

function buildPath(data, width, height) {
    if (!data || data.length === 0) return { linePath: '', areaPath: '' };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const scaleY = (val) => CHART_PADDING_TOP + (height - CHART_PADDING_TOP - CHART_PADDING_BOTTOM) * (1 - (val - min) / range);

    let linePath = `M 0 ${scaleY(data[0])}`;
    for (let i = 1; i < data.length; i++) {
        const x = i * stepX;
        const y = scaleY(data[i]);
        const prevX = (i - 1) * stepX;
        const prevY = scaleY(data[i - 1]);
        const cpX = (prevX + x) / 2;
        linePath += ` Q ${cpX} ${prevY} ${x} ${y}`;
    }
    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
    return { linePath, areaPath };
}

export default function StockChart({ data, isPositive = false, dipMarkers = [], onDipPress, chartWidth }) {
    const [selectedPeriod, setSelectedPeriod] = useState('1D');
    const [touchData, setTouchData] = useState(null);

    const CHART_WIDTH = chartWidth || (SCREEN_WIDTH - spacing.lg * 2);
    const lineColor = isPositive ? colors.stockGreen : colors.stockRed;
    const { linePath, areaPath } = buildPath(data, CHART_WIDTH, CHART_HEIGHT);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = CHART_WIDTH / (data.length - 1);
    const scaleY = (val) => CHART_PADDING_TOP + (CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM) * (1 - (val - min) / range);

    const handleTouch = (evt) => {
        const x = evt.nativeEvent.locationX;
        const index = Math.round((x / CHART_WIDTH) * (data.length - 1));
        const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
        const pointX = clampedIndex * stepX;
        const pointY = scaleY(data[clampedIndex]);
        setTouchData({ x: pointX, y: pointY, price: data[clampedIndex], index: clampedIndex });
    };

    return (
        <View style={styles.container}>
            <View
                style={[styles.chartContainer, { width: CHART_WIDTH }]}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleTouch}
                onResponderMove={handleTouch}
                onResponderRelease={() => setTouchData(null)}
            >
                <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                    <Defs>
                        <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={lineColor} stopOpacity="0.35" />
                            <Stop offset="0.6" stopColor={lineColor} stopOpacity="0.08" />
                            <Stop offset="1" stopColor={lineColor} stopOpacity="0" />
                        </SvgLinearGradient>
                    </Defs>
                    <Path d={areaPath} fill="url(#areaGrad)" />
                    <Path d={linePath} stroke={lineColor} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Scrubber */}
                    {touchData && (
                        <>
                            <Line x1={touchData.x} y1={0} x2={touchData.x} y2={CHART_HEIGHT} stroke={colors.textSecondary} strokeWidth={0.5} strokeDasharray="4,3" />
                            <Circle cx={touchData.x} cy={touchData.y} r={5} fill={lineColor} stroke={colors.background} strokeWidth={2} />
                        </>
                    )}
                </Svg>

                {/* Dip markers - pulsing dots rendered as Views over the SVG */}
                {dipMarkers.map((dip, i) => {
                    if (dip.index >= data.length) return null;
                    const dx = dip.index * stepX;
                    const dy = scaleY(data[dip.index]);
                    return (
                        <View key={`marker-${i}`} style={[styles.dipMarkerGlow, { left: dx - 12, top: dy - 12 }]} pointerEvents="none">
                            <View style={styles.dipMarkerInner}>
                                <View style={styles.dipMarkerCore} />
                            </View>
                        </View>
                    );
                })}

                {/* Tappable dip marker overlays */}
                {dipMarkers.map((dip, i) => {
                    if (dip.index >= data.length) return null;
                    const dx = dip.index * stepX;
                    const dy = scaleY(data[dip.index]);
                    return (
                        <TouchableOpacity
                            key={`tap-${i}`}
                            activeOpacity={0.6}
                            onPress={() => onDipPress && onDipPress(dip, i)}
                            style={[
                                styles.dipTouchTarget,
                                {
                                    left: dx - 22,
                                    top: dy - 22,
                                    position: 'absolute',
                                    zIndex: 100,
                                    elevation: 10
                                }
                            ]}
                        >
                            <Text style={styles.dipIcon}>✦</Text>
                        </TouchableOpacity>
                    );
                })}

            </View>

            {/* Time period selector */}
            <View style={styles.periodRow}>
                {TIME_PERIODS.map((period) => (
                    <TouchableOpacity
                        key={period}
                        onPress={() => setSelectedPeriod(period)}
                        style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
                    >
                        <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>{period}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    chartContainer: { height: CHART_HEIGHT, position: 'relative', zIndex: 1 },
    tooltip: {
        position: 'absolute', top: -30,
        backgroundColor: colors.cardBackgroundElevated,
        paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        zIndex: 50,
    },
    tooltipText: { ...typography.caption1, color: colors.textPrimary, fontWeight: '600' },
    dipTouchTarget: {
        position: 'absolute', width: 44, height: 44,
        justifyContent: 'center', alignItems: 'center', zIndex: 10,
    },
    dipIcon: { fontSize: 14, color: colors.aiGlow, opacity: 0 }, // invisible overlay, the SVG circle is visible
    dipMarkerGlow: {
        position: 'absolute', width: 24, height: 24, borderRadius: 12,
        backgroundColor: 'rgba(167, 139, 250, 0.2)',
        justifyContent: 'center', alignItems: 'center', zIndex: 15,
    },
    dipMarkerInner: {
        width: 14, height: 14, borderRadius: 7,
        backgroundColor: 'rgba(167, 139, 250, 0.4)',
        justifyContent: 'center', alignItems: 'center',
    },
    dipMarkerCore: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: colors.aiGlow,
    },
    periodRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginTop: spacing.lg, paddingHorizontal: spacing.xs,
    },
    periodButton: {
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        borderRadius: borderRadius.pill,
    },
    periodButtonActive: { backgroundColor: colors.cardBackgroundElevated },
    periodText: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600' },
    periodTextActive: { color: colors.textPrimary },
});
