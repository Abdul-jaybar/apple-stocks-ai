import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
    Modal, Animated, Dimensions, ScrollView, Platform, PanResponder, TextInput,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { aiScenarios, deepStats, userProfile } from '../data/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;

function ScenarioCard({ scenario, variant, onActionPress, holding }) {
    const isBull = variant === 'bull';
    const [pressed, setPressed] = useState(false);

    const handlePress = async () => {
        if (Platform.OS !== 'web') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setPressed(true);
        onActionPress(variant);
        setTimeout(() => setPressed(false), 800);
    };

    const actionLabel = isBull
        ? (holding ? `Buy ${Math.min(50, Math.floor(15000 / (holding.currentPrice || 12)))} more shares` : 'Add to position')
        : 'Hold & Set Price Alert';

    const actionSub = isBull
        ? `Dollar-cost average at $${(holding?.currentPrice || 12).toFixed(2)}`
        : 'Monitor for further signals';

    return (
        <View style={[styles.scenarioCard, isBull ? styles.scenarioCardBull : styles.scenarioCardBear]}>
            <View style={styles.scenarioHeader}>
                <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                <View style={[styles.confidenceBadge, isBull ? styles.confidenceBull : styles.confidenceBear]}>
                    <Text style={[styles.confidenceText, { color: isBull ? colors.stockGreen : colors.stockRed }]}>
                        {scenario.confidence}%
                    </Text>
                </View>
            </View>
            {scenario.signals.map((signal, i) => (
                <View key={i} style={styles.signalRow}>
                    <Text style={styles.signalIcon}>{signal.icon}</Text>
                    <View style={styles.signalContent}>
                        <Text style={styles.signalLabel}>{signal.label}</Text>
                        <Text style={styles.signalDetail}>{signal.detail}</Text>
                    </View>
                </View>
            ))}
            <TouchableOpacity
                activeOpacity={0.7} onPress={handlePress}
                style={[styles.actionButton, isBull ? styles.actionPrimary : styles.actionSecondary, pressed && styles.actionPressed]}
            >
                <Text style={[styles.actionLabel, isBull ? styles.actionLabelPrimary : styles.actionLabelSecondary]}>
                    {pressed ? '✓ ' : ''}{actionLabel}
                </Text>
                <Text style={[styles.actionSublabel, !isBull && { color: colors.textTertiary }]}>
                    {pressed ? 'Order placed!' : actionSub}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default function CoTraderSheet({ visible, onClose, onBuy, onSell, holding }) {
    const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const [showSellConfirm, setShowSellConfirm] = useState(false);
    const [sellShares, setSellShares] = useState('');

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gs) => gs.dy > 10,
            onPanResponderMove: (_, gs) => { if (gs.dy > 0) slideAnim.setValue(gs.dy); },
            onPanResponderRelease: (_, gs) => {
                if (gs.dy > 100 || gs.vy > 0.5) closeSheet();
                else Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            setShowSellConfirm(false);
            setSellShares('');
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const closeSheet = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: SHEET_HEIGHT, duration: 250, useNativeDriver: true }),
            Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start(() => onClose());
    };

    const handleBull = () => {
        const buyShares = Math.min(50, Math.floor(15000 / (holding?.currentPrice || 12)));
        if (onBuy) onBuy(holding?.ticker || 'WS', buyShares);
        setTimeout(closeSheet, 800);
    };

    const handleBear = () => {
        setShowSellConfirm(true);
    };

    const confirmSell = () => {
        const num = parseInt(sellShares) || 0;
        if (num > 0 && onSell) {
            onSell(holding?.ticker || 'WS', num);
            setTimeout(closeSheet, 800);
        }
    };

    if (!visible) return null;

    const ticker = holding?.ticker || 'WS';
    const pos = holding?.position || 'long';
    const alloc = holding
        ? `${((holding.shares * holding.currentPrice) / (userProfile.totalCash + 80000) * 100).toFixed(0)}%`
        : '20%';

    const Wrapper = Platform.OS === 'web' ? View : Modal;
    const wrapperProps = Platform.OS === 'web'
        ? { style: styles.webModalOverlay }
        : { transparent: true, visible, animationType: 'none', statusBarTranslucent: true };

    return (
        <Wrapper {...wrapperProps}>
            <TouchableWithoutFeedback onPress={closeSheet}>
                <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }], height: SHEET_HEIGHT }]} {...panResponder.panHandlers}>
                <View style={styles.handleContainer}><View style={styles.handleBar} /></View>
                <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false} bounces>
                    <View style={styles.sheetHeader}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.sparkleIcon}>✦</Text>
                            <Text style={styles.sheetTitle}>AI Co-Trader</Text>
                        </View>
                        <View style={styles.profileBadge}>
                            <Text style={styles.profileText}>{userProfile.name} · {userProfile.strategy}</Text>
                        </View>
                    </View>
                    <View style={styles.contextBar}>
                        <Text style={styles.contextText}>
                            {ticker} · {alloc} of portfolio ·{' '}
                            <Text style={{ color: pos === 'long' ? colors.stockGreen : colors.stockRed }}>{pos.toUpperCase()}</Text>
                            {holding && ` · ${holding.shares} shares`}
                        </Text>
                    </View>

                    {!showSellConfirm ? (
                        <>
                            <ScenarioCard scenario={aiScenarios.bullCase} variant="bull" onActionPress={handleBull} holding={holding} />
                            <ScenarioCard scenario={aiScenarios.bearCase} variant="bear" onActionPress={handleBear} holding={holding} />
                        </>
                    ) : (
                        <View style={styles.sellConfirmBox}>
                            <Text style={styles.sellTitle}>Sell / Reduce Position</Text>
                            <Text style={styles.sellSubtitle}>You currently hold {holding?.shares || 0} shares of {ticker}</Text>
                            <View style={styles.sellInputRow}>
                                <TextInput
                                    style={styles.sellInput}
                                    value={sellShares}
                                    onChangeText={setSellShares}
                                    placeholder="Shares to sell"
                                    placeholderTextColor={colors.textTertiary}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.sellValue}>
                                    ≈ ${((parseInt(sellShares) || 0) * (holding?.currentPrice || 12)).toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.quickSellRow}>
                                {[10, 25, 50, 100].map(pct => (
                                    <TouchableOpacity key={pct} style={styles.quickSellBtn}
                                        onPress={() => setSellShares(String(Math.floor((holding?.shares || 0) * pct / 100)))}>
                                        <Text style={styles.quickSellText}>{pct}%</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity style={styles.confirmSellBtn} onPress={confirmSell} activeOpacity={0.7}>
                                <Text style={styles.confirmSellText}>✓ Confirm Sell Order</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowSellConfirm(false)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>← Back to Analysis</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text style={styles.disclaimer}>AI analysis is for informational purposes only. Not financial advice.</Text>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </Animated.View>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
    webModalOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
    sheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.sheetBackground,
        borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl,
        ...Platform.select({
            web: { boxShadow: '0px -4px 12px rgba(0,0,0,0.4)' },
            default: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 12 },
        }),
    },
    handleContainer: { alignItems: 'center', paddingTop: 10, paddingBottom: 6 },
    handleBar: { width: 36, height: 5, borderRadius: 3, backgroundColor: colors.textTertiary },
    sheetScroll: { flex: 1 },
    sheetContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, marginTop: spacing.xs },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    sparkleIcon: { fontSize: 20, color: colors.aiGlow, marginRight: spacing.sm },
    sheetTitle: { ...typography.title3, color: colors.textPrimary },
    profileBadge: { backgroundColor: colors.aiGlowDim, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.pill },
    profileText: { ...typography.caption2, color: colors.aiGlow, fontWeight: '600' },
    contextBar: { backgroundColor: colors.cardBackgroundElevated, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.sm, marginBottom: spacing.lg },
    contextText: { ...typography.footnote, color: colors.textSecondary },
    scenarioCard: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1 },
    scenarioCardBull: { backgroundColor: 'rgba(52,199,89,0.06)', borderColor: 'rgba(52,199,89,0.15)' },
    scenarioCardBear: { backgroundColor: 'rgba(255,59,48,0.06)', borderColor: 'rgba(255,59,48,0.15)' },
    scenarioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    scenarioTitle: { ...typography.headline, color: colors.textPrimary },
    confidenceBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.pill },
    confidenceBull: { backgroundColor: colors.stockGreenDim },
    confidenceBear: { backgroundColor: colors.stockRedDim },
    confidenceText: { ...typography.caption1, fontWeight: '700' },
    signalRow: { flexDirection: 'row', marginBottom: spacing.md },
    signalIcon: { fontSize: 16, marginRight: spacing.md, marginTop: 2 },
    signalContent: { flex: 1 },
    signalLabel: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    signalDetail: { ...typography.subheadline, color: colors.textPrimary, lineHeight: 20 },
    actionButton: { marginTop: spacing.sm, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', minHeight: 50, justifyContent: 'center' },
    actionPrimary: { backgroundColor: colors.stockGreen },
    actionSecondary: { backgroundColor: colors.cardBackgroundElevated, borderWidth: 1, borderColor: colors.separator },
    actionPressed: { opacity: 0.8 },
    actionLabel: { ...typography.headline, marginBottom: 2 },
    actionLabelPrimary: { color: '#FFF' },
    actionLabelSecondary: { color: colors.textPrimary },
    actionSublabel: { ...typography.caption1, color: 'rgba(255,255,255,0.7)' },
    disclaimer: { ...typography.caption2, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.sm },
    // Sell confirm
    sellConfirmBox: { backgroundColor: 'rgba(255,59,48,0.06)', borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,59,48,0.15)' },
    sellTitle: { ...typography.title3, color: colors.textPrimary, marginBottom: spacing.xs },
    sellSubtitle: { ...typography.subheadline, color: colors.textSecondary, marginBottom: spacing.lg },
    sellInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
    sellInput: {
        flex: 1, backgroundColor: colors.cardBackgroundElevated, borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md, paddingVertical: spacing.md, ...typography.headline, color: colors.textPrimary,
        borderWidth: 1, borderColor: colors.separator, marginRight: spacing.md,
    },
    sellValue: { ...typography.headline, color: colors.textSecondary, minWidth: 80 },
    quickSellRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
    quickSellBtn: { flex: 1, backgroundColor: colors.cardBackgroundElevated, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.separator },
    quickSellText: { ...typography.footnote, color: colors.textPrimary, fontWeight: '600' },
    confirmSellBtn: { backgroundColor: colors.stockRed, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center', minHeight: 50, justifyContent: 'center', marginBottom: spacing.sm },
    confirmSellText: { ...typography.headline, color: '#FFF' },
    cancelBtn: { paddingVertical: spacing.sm, alignItems: 'center' },
    cancelText: { ...typography.subheadline, color: colors.textSecondary },
});
